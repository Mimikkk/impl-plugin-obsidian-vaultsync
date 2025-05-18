export const lazy = <T>(fn: () => T) => {
  let value: T;
  let called = false;

  return () => {
    if (!called) {
      value = fn();
      called = true;
    }

    return value;
  };
};
