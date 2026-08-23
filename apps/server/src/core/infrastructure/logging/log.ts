import { styleText } from "node:util";

export namespace Log {
  export const info: typeof console.info = (...message) => {
    console.info(styleText(["bold", "blue"], "[info]"), ...message);
  };

  export const error: typeof console.error = (...message) => {
    console.error(styleText(["bold", "red"], "[error]"), ...message);
  };

  export const warn: typeof console.warn = (...message) => {
    console.warn(styleText(["bold", "yellow"], "[warn]"), ...message);
  };

  export const event: typeof console.info = (...message) => {
    console.info(styleText(["bold", "green"], "[event]"), ...message);
  };
}
