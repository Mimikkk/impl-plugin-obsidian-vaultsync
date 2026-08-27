export type Op =
  | { type: "remember"; path: string; hash: string }
  | { type: "forget"; path: string }
  | { type: "upload"; path: string }
  | { type: "download"; path: string }
  | { type: "removeLocal"; path: string }
  | { type: "removeRemote"; path: string }
  | { type: "conflict"; localPath: string; remotePath: string };

export function plan(
  local: Map<string, string>,
  remote: Map<string, string>,
  bases: Record<string, string>,
): Op[] {
  const ops: Op[] = [];
  const pendingLocal = new Map(local);
  const pendingRemote = new Map(remote);

  for (const path of new Set([...local.keys(), ...remote.keys()])) {
    const localHash = local.get(path);
    const remoteHash = remote.get(path);
    if (!localHash || !remoteHash) continue;

    pendingLocal.delete(path);
    pendingRemote.delete(path);

    if (localHash === remoteHash) {
      ops.push({ type: "remember", path, hash: localHash });
      continue;
    }

    const base = bases[path];
    if (base === remoteHash) ops.push({ type: "upload", path });
    else if (base === localHash) ops.push({ type: "download", path });
    else ops.push({ type: "conflict", localPath: path, remotePath: path });
  }

  for (const [localPath, localHash] of pendingLocal) {
    let remotePath: string | undefined;
    for (const [path, hash] of pendingRemote) {
      if (hash === localHash) {
        remotePath = path;
        break;
      }
    }
    if (!remotePath) continue;

    pendingLocal.delete(localPath);
    pendingRemote.delete(remotePath);

    const baseLocal = bases[localPath];
    const baseRemote = bases[remotePath];
    if (baseRemote === localHash && baseLocal !== localHash) {
      ops.push(
        { type: "removeRemote", path: remotePath },
        { type: "upload", path: localPath },
        { type: "forget", path: remotePath },
      );
    } else if (baseLocal === localHash && baseRemote !== localHash) {
      ops.push(
        { type: "removeLocal", path: localPath },
        { type: "download", path: remotePath },
        { type: "forget", path: localPath },
      );
    } else {
      ops.push({ type: "conflict", localPath, remotePath });
      for (const [path, hash] of Object.entries(bases)) {
        if (hash === localHash && !local.has(path) && !remote.has(path)) {
          ops.push({ type: "forget", path });
        }
      }
    }
  }

  const stale = Object.keys(bases).filter((path) => !local.has(path) && !remote.has(path));
  while (stale.length > 0 && pendingLocal.size > 0 && pendingRemote.size > 0) {
    const ancestor = stale.pop()!;
    const localPath = pendingLocal.keys().next().value!;
    const remotePath = pendingRemote.keys().next().value!;
    pendingLocal.delete(localPath);
    pendingRemote.delete(remotePath);
    ops.push({ type: "conflict", localPath, remotePath }, { type: "forget", path: ancestor });
  }

  for (const [path, hash] of pendingLocal) {
    if (bases[path] === hash) ops.push({ type: "removeLocal", path }, { type: "forget", path });
    else ops.push({ type: "upload", path });
  }

  for (const [path, hash] of pendingRemote) {
    if (bases[path] === hash) ops.push({ type: "removeRemote", path }, { type: "forget", path });
    else ops.push({ type: "download", path });
  }

  return ops;
}
