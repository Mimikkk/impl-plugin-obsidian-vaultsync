export namespace HashService {
  export const hash = async (buffer: ArrayBuffer): Promise<ArrayBuffer> =>
    await crypto.subtle.digest("SHA-256", buffer);

  export const areEqual = async (a: ArrayBuffer, b: ArrayBuffer): Promise<boolean> => {
    const [hash1, hash2] = await Promise.all([hash(a), hash(b)]);
    return areBuffersEqual(hash1, hash2);
  };

  const areBuffersEqual = (a: ArrayBuffer, b: ArrayBuffer): boolean => areViewsEqual(new DataView(a), new DataView(b));

  const areViewsEqual = (a: DataView, b: DataView): boolean => {
    if (a.byteLength !== b.byteLength) return false;
    for (let i = 0; i < a.byteLength; i++) {
      if (a.getUint8(i) !== b.getUint8(i)) return false;
    }
    return true;
  };
}
