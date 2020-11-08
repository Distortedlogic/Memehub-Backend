import dayjs from "dayjs";

export const getCurrent = () =>
  dayjs()
    .subtract(30, "day")
    .set("second", 0)
    .set("minute", 0)
    .set("hour", 0)
    .set("millisecond", 0);
