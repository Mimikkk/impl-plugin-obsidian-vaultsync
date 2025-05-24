export namespace TimeMs {
  export const seconds = (n: number) => n * 1000;
  export const minutes = (n: number) => n * 1000 * 60;
  export const hours = (n: number) => n * 1000 * 60 * 60;
  export const days = (n: number) => n * 1000 * 60 * 60 * 24;

  export const s1 = seconds(1);
  export const m5 = minutes(5);
}
