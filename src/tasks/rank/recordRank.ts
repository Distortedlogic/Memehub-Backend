import dayjs from "dayjs";
import { getConnection } from "typeorm";
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
    const userPast = past.filter((rank) => rank.userId === userRank.id)[0];
    return Rank.create({
      userId: userRank.id,
      rank: 0,
      timeFrame,
      totalPoints: userRank.totalPoints - (userPast ? userPast.totalPoints : 0),
      createdAt: createdAt.toDate(),
    });
  });
  newRanks.sort((a, b) => b.totalPoints - a.totalPoints);
  newRanks.forEach((userRank, idx) => {
    userRank.rank = idx + 1;
  });
  await Rank.save(newRanks);
};

export const recordRank = async () => {
  const createdAt = dayjs().set("m", 0).set("ms", 0);
  const userRanks: userRank = await getConnection()
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
      createdAt: createdAt.toDate(),
    });
  });
  await Rank.save(everRanks);
  await constructDiff(userRanks, "day", createdAt);
  await constructDiff(userRanks, "week", createdAt);
  await constructDiff(userRanks, "month", createdAt);
};
