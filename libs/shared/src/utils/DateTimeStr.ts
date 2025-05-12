export type DateInit = string | number | Date;

export namespace DateTimeStr {
  export const asDate = (date: DateInit) => new Date(date);
  export const asTimestamp = (date: DateInit) => asDate(date).getTime();
}

export namespace DateTimeNs {
  const self = DateTimeStr;

  export const compare = (a: DateInit, b: DateInit) => self.asTimestamp(a) - self.asTimestamp(b);

  export const isAfter = (a: DateInit, b: DateInit) => compare(a, b) > 0;
  export const isAfterOrEqual = (a: DateInit, b: DateInit) => compare(a, b) >= 0;
  export const isBefore = (a: DateInit, b: DateInit) => compare(a, b) < 0;
  export const isBeforeOrEqual = (a: DateInit, b: DateInit) => compare(a, b) <= 0;
  export const isSame = (a: DateInit, b: DateInit) => compare(a, b) === 0;

  export const within = (a: DateInit, b: DateInit, ms: number) => Math.abs(compare(a, b)) <= ms;
}
