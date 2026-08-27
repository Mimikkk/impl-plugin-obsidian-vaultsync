let depth = 0;

export const applyingRemote = {
  get quiet() {
    return depth > 0;
  },
  async run<T>(fn: () => Promise<T>): Promise<T> {
    depth += 1;
    try {
      return await fn();
    } finally {
      depth -= 1;
    }
  },
};
