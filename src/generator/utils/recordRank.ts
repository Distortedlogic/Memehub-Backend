import dayjs from "dayjs";
import { Connection } from "typeorm";
import { Rank } from "../../models/rank/entities/Rank";
import { User } from "./../../models/user/entities/User";
import { constructDiff, userRank } from "./../../tasks/recordRank";

export const recordRank = async (conn: Connection, current: dayjs.Dayjs) => {
  const userRanks: userRank = await conn
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id", "id")
    .addSelect("user.mhp", "mhp")
    .addSelect("user.gbp", "gbp")
    .orderBy("user.mhp", "DESC")
    .addOrderBy("user.gbp", "DESC")
    .getRawMany();
  const everRanks = userRanks.map((userRank, idx) => {
    return Rank.create({
      userId: userRank.id,
      mhpRank: idx + 1,
      gbpRank: 0,
      timeFrame: "ever",
      mhp: userRank.mhp,
      gbp: userRank.gbp,
      createdAt: current.toDate(),
    });
  });
  everRanks.sort((a, b) => b.gbp - a.gbp);
  everRanks.forEach((userRank, idx) => {
    userRank.gbpRank = idx + 1;
  });
  await Rank.save(everRanks);
  await constructDiff(userRanks, "day", current);
  await constructDiff(userRanks, "week", current);
  await constructDiff(userRanks, "month", current);
  return 0;
};
