import { getConnection } from "typeorm";
import { Rank } from "./../../models/rank/Rank.entity";
import { User } from "./../../models/user/User.entity";

export const recordRank = async () => {
  const createdAt = new Date(new Date().setMinutes(0, 0, 0));
  const userRanks = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id", "id")
    .addSelect("user.totalPoints", "totalPoints")
    .orderBy("user.totalPoints", "DESC")
    .addOrderBy("user.numMemeUpvotesRecieved", "DESC")
    .addOrderBy("user.createdAt", "DESC")
    .getRawMany();
  const ranks = userRanks.map((userRank, idx) => {
    return Rank.create({
      userId: userRank.id,
      rank: idx + 1,
      totalPoints: userRank.totalPoints,
      createdAt,
    });
  });
  await Rank.save(ranks);
};
