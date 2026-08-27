# Obsidian plugin - VaultSync

VaultSync syncs Obsidian vaults through a server you host. The server is the canonical copy. Clients auto-upload local edits. A full sync pulls remote changes and opens a diff window when both sides diverged.

## Getting Started

### Prerequisites

- **[Bun](https://bun.sh/)**
- **[Obsidian](https://obsidian.md/)** v1.8.10+
- **[Docker](https://www.docker.com/)** or **[Kubernetes](https://kubernetes.io/)** if you want to containerize the server

### Setup

1. Clone the repository.

2. Configure env files:

   **Server** (`apps/server/.env`):

   ```bash
   cp apps/server/.env.local apps/server/.env
   ```

   ```
   SERVER_PORT=8080
   SERVER_HOST=127.0.0.1
   STORAGE_URL=/path/to/your/storage
   ```

   **Plugin** (`apps/plugin/.env`):

   ```bash
   cp apps/plugin/.env.local apps/plugin/.env
   ```

   ```
   VAULT_SYNC_CLIENT_URL=http://127.0.0.1:8080
   VAULT_PATH=/path/to/your/obsidian/vault
   ```

3. Start plugin + server:

   ```bash
   bun install
   bun run dev
   ```

4. Enable the plugin in Obsidian (Community Plugins → Vault Sync).

### Verify

- Server health: http://127.0.0.1:8080/health
- Plugin appears in Obsidian
- Edit a note: it uploads without pressing sync
- Ribbon **Synchronize** pulls remotes; conflicts open a keep-local / keep-remote diff

## Docker

```bash
docker compose -f apps/server/docker-compose.yml up --build
```

`STORAGE_URL` on the host is mounted at `/data` in the container.

## Kubernetes

```bash
docker build -f apps/server/Dockerfile -t vaultsync-server:latest .
kubectl apply -f k8s/server.yaml
# optional
kubectl apply -f k8s/ingress.yaml
```

One replica, one PVC. Point the plugin at the Ingress/Service URL.

## Usage

1. Edit notes as usual (auto-upload).
2. Press **Synchronize** to pull.
3. If the same file changed on both sides since last successful sync, pick **Keep local**, **Keep remote**, or **Skip**.

## Mobile

Install the same Obsidian plugin on mobile and point `VAULT_SYNC_CLIENT_URL` at your server. No Syncthing.

## Architecture

- **Plugin**: local vault I/O, auto-upload, 3-way conflict detection via stored `baseHash`
- **Server**: filesystem at `STORAGE_URL`, HTTP file API, watch-based event pool
- **Ship unit**: one server container + one volume
