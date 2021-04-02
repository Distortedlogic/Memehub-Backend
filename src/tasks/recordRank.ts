import dayjs from "dayjs";
import { getConnection } from "typeorm";
import { Rank } from "../models/rank/entities/Rank";
import { User } from "../models/user/entities/User";

type userRank = {
  id: string;
  mhp: number;
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
      throw new Error("bad timeframe");
  }
};

/**
 * Construct and Save ranks over a specific timeframe
 * from raw db data
 *
 * @param {userRank} userRanks
 * @param {string} timeFrame
 * @param {dayjs.Dayjs} createdAt
 */
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
    const userPast = past.filter((rank) => rank.userId === userRank.id)[0];
    return Rank.create({
      userId: userRank.id,
      rank: 0,
      timeFrame,
      mhp: userRank.mhp - (userPast ? userPast.mhp : 0),
      createdAt: createdAt.toDate(),
    });
  });
  newRanks.sort((a, b) => b.mhp - a.mhp);
  newRanks.forEach((userRank, idx) => {
    userRank.rank = idx + 1;
  });
  await Rank.save(newRanks);
};

// Construct rankings and save to db
export const recordRank = async () => {
  const createdAt = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0);
  const userRanks: userRank = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id", "id")
    .addSelect("user.mhp", "mhp")
    .orderBy("user.mhp", "DESC")
    .addOrderBy("user.numMemeUpvotesRecieved", "DESC")
    .addOrderBy("user.createdAt", "DESC")
    .getRawMany();
  const everRanks = userRanks.map((userRank, idx) => {
    return Rank.create({
      userId: userRank.id,
      rank: idx + 1,
      timeFrame: "ever",
      mhp: userRank.mhp,
      createdAt: createdAt.toDate(),
    });
  });
  await Rank.save(everRanks);
  await constructDiff(userRanks, "day", createdAt);
  await constructDiff(userRanks, "week", createdAt);
  await constructDiff(userRanks, "month", createdAt);
};
