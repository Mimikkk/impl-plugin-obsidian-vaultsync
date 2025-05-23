interface Transformer<T = any> {
  name: string;
  test: (value: any) => value is T;
  transform: (value: T) => string;
}

const transformers: Transformer[] = [
  {
    name: "array",
    test: (value: any): value is any[] => Array.isArray(value),
    transform: (value: any[]) => value.join(","),
  },
  {
    name: "string",
    test: (value: any): value is string => typeof value === "string" && !!value,
    transform: (value: string) => value,
  },
  {
    name: "number",
    test: (value: any): value is number => typeof value === "number",
    transform: (value: number) => value.toString(),
  },
];
export const serializeSearchParams = <P extends object | undefined>(params: P): URLSearchParams | undefined => {
  if (!params) return undefined;

  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;

    const handler = transformers.find((handler) => handler.test(value));
    if (!handler) continue;

    result.set(key, handler.transform(value));
  }

  return result;
};
