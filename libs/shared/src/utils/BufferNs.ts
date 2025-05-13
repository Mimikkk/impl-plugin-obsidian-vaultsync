export namespace BufferNs {
  export function toString(buffer: ArrayBuffer): string {
    return btoa(
      Array.from(new Uint8Array(buffer))
        .map((byte) => String.fromCharCode(byte))
        .join(""),
    );
  }
}
