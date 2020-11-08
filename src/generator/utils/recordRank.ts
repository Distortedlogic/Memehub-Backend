import dayjs from "dayjs";
import { Connection } from "typeorm";
import { Rank } from "./../../models/rank/Rank.entity";
import { User } from "./../../models/user/User.entity";

type userRank = {
  id: string;
  totalPoints: number;
}[];

const tfSwitch = (timeFrame: string) => {
  switch (timeFrame) {
    case "day":
      return 1;
    case "week":
      return 7;
    case "month":
      return 30;
    default:
      return -1;
  }
};

const constructDiff = async (
  userRanks: userRank,
  timeFrame: string,
  createdAt: dayjs.Dayjs
) => {
  const past = await Rank.find({
    createdAt: createdAt.subtract(tfSwitch(timeFrame), "d").toDate(),
    timeFrame: "ever",
  });
  const newRanks = userRanks.map((userRank) => {
    const userWeekDay = past.filter((rank) => rank.userId === userRank.id)[0];
    return Rank.create({
      userId: userRank.id,
      rank: 0,
      timeFrame,
      totalPoints:
        userRank.totalPoints - (userWeekDay ? userWeekDay.totalPoints : 0),
      createdAt: createdAt.toDate(),
    });
  });
  newRanks.sort((a, b) => b.totalPoints - a.totalPoints);
  newRanks.forEach((userRank, idx) => {
    userRank.rank = idx + 1;
  });
  await Rank.save(newRanks);
};

export const recordRank = async (conn: Connection, current: dayjs.Dayjs) => {
  const userRanks: userRank = await conn
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id", "id")
    .addSelect("user.totalPoints", "totalPoints")
    .orderBy("user.totalPoints", "DESC")
    .addOrderBy("user.numMemeUpvotesRecieved", "DESC")
    .addOrderBy("user.createdAt", "DESC")
    .getRawMany();
  const everRanks = userRanks.map((userRank, idx) => {
    return Rank.create({
      userId: userRank.id,
      rank: idx + 1,
      timeFrame: "ever",
      totalPoints: userRank.totalPoints,
      createdAt: current.toDate(),
    });
  });
  await Rank.save(everRanks);
  await constructDiff(userRanks, "day", current);
  await constructDiff(userRanks, "week", current);
  await constructDiff(userRanks, "month", current);
  return 0;
};
