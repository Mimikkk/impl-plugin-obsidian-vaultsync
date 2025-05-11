export interface FileDescriptor {
  path: string;
  updatedAt: number;
}

export namespace FileDescriptorNs {
  export const compare = (a: FileDescriptor, b: FileDescriptor) => a.updatedAt - b.updatedAt;

  export const isNewer = (a: FileDescriptor, b: FileDescriptor) => compare(a, b) > 0;
  export const isOlder = (a: FileDescriptor, b: FileDescriptor) => compare(a, b) < 0;
  export const isSame = (a: FileDescriptor, b: FileDescriptor) => compare(a, b) === 0;
}
