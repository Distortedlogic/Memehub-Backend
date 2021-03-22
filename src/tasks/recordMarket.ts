import dayjs from "dayjs";
export const recordRank = async () => {
  const createdAt = dayjs().set("m", 0).set("ms", 0);
  console.log(createdAt);
};
