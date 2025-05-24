import { singleton } from "@nimir/framework";
import { BufferNs } from "@nimir/shared";

@singleton
export class FileHasher {
  static create() {
    return new FileHasher();
  }

  async hash(buffer: ArrayBuffer): Promise<string> {
    const hash = await crypto.subtle.digest("SHA-256", buffer);

    return BufferNs.toString(hash);
  }
}
