export namespace Str {
  const newlineRe = /\r\n|\r|\n/;
  const startNewlineRe = /^\r\n|\r|\n/;

  export const lines = (value: string): string[] => {
    const lines = value.split(newlineRe);
    if (lines[lines.length - 1] === "") lines.pop();
    return lines;
  };

  export const trimlines = (strings: TemplateStringsArray, ...values: unknown[]): string => {
    const str = String.raw({ raw: strings }, ...values).replace(startNewlineRe, "");
    const lines = Str.lines(str);

    const offset = Math.min(...lines.map((l) => l.length - l.trimStart().length));

    return lines
      .map((line) => line.trimEnd().substring(offset))
      .join("\n")
      .trimEnd();
  };
}
