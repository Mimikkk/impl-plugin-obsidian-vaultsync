export namespace BufferHashComparator {
  export async function equals(a: ArrayBuffer, b: ArrayBuffer): Promise<boolean> {
    const [hash1, hash2] = await Promise.all([hash(a), hash(b)]);
    return areBuffersEqual(hash1, hash2);
  }

  async function hash(buffer: ArrayBuffer): Promise<ArrayBuffer> {
    return await crypto.subtle.digest("SHA-256", buffer);
  }

  function areBuffersEqual(a: ArrayBuffer, b: ArrayBuffer): boolean {
    return areViewsEqual(new DataView(a), new DataView(b));
  }

  function areViewsEqual(a: DataView, b: DataView): boolean {
    if (a.byteLength !== b.byteLength) return false;

    for (let i = 0; i < a.byteLength; i++) {
      if (a.getUint8(i) !== b.getUint8(i)) return false;
    }

    return true;
  }
}
