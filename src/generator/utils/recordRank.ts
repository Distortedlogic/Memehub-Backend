import dayjs from "dayjs";
import { Connection } from "typeorm";
import { Rank } from "./../../models/rank/Rank.entity";
import { User } from "./../../models/user/User.entity";
export const recordRank = async (conn: Connection, current: dayjs.Dayjs) => {
  let numErrors = 0;
  const userRanks = await conn
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id", "id")
    .addSelect("user.totalPoints", "totalPoints")
    .orderBy("user.totalPoints", "DESC")
    .addOrderBy("user.numMemeUpvotesRecieved", "DESC")
    .addOrderBy("user.createdAt", "DESC")
    .getRawMany();
  const ranks = userRanks.map((userRank, idx) => ({
    userId: userRank.id,
    rank: idx + 1,
    totalPoints: userRank.totalPoints,
    createdAt: current.toDate(),
  }));
  await conn.createQueryBuilder().insert().into(Rank).values(ranks).execute();
  return numErrors;
};
