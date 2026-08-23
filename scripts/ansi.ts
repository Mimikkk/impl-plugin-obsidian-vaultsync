import { styleText } from "node:util";

export const colors = {
  green: (s: string) => styleText("green", s),
  red: (s: string) => styleText("red", s),
  blue: (s: string) => styleText("blue", s),
  yellow: (s: string) => styleText("yellow", s),
  gray: (s: string) => styleText("gray", s),
};
