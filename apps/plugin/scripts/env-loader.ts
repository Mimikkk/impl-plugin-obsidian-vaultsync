export default function loader(content: string): string {
  const lines = content.split("\n");

  const result: Record<string, string> = {};
  for (const line of lines) {
    const [key, value] = line.split("=");

    result[key] = value;
  }

  return JSON.stringify(result);
}
