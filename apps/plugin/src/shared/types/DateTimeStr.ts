export type DateInit = string;

export namespace DateTimeStr {
  export const asDate = (date: DateInit) => new Date(date);
  export const asTimestamp = (date: DateInit) => asDate(date).getTime();
}
