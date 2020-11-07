import dayjs from "dayjs";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { Equal, In, Not } from "typeorm";
import { ServerContext } from "./../../ServerContext";
import { Rank } from "./Rank.entity";
import { PaginatedRanks } from "./_types";

@Resolver(Rank)
export class RankQueryResolver {
  @Query(() => [Rank])
  async userRanks(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("userId", () => String, { nullable: true }) userId?: string
  ): Promise<Rank[]> {
    if (!userId) userId = session.userId;
    const current = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0);
    const times = Array(30)
      .fill(30)
      .map((_, idx) => current.subtract(idx, "d").toDate());
    return await Rank.find({
      where: { userId, createdAt: In(times) },
      order: { createdAt: "ASC" },
    });
  }

  @Query(() => PaginatedRanks)
  async ranking(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("td", () => Int) td: number
  ): Promise<PaginatedRanks> {
    const realTake = Math.min(50, take);
    if (![-1, 1, 7, 30].includes(td)) return { items: [], hasMore: false };
    const createdAt = new Date(new Date().setMinutes(0, 0, 0));
    const ranks = await Rank.find({
      where: { createdAt, rank: Not(Equal(0)) },
      order: { rank: "ASC" },
      take: realTake,
      skip,
    });
    if (td === -1) {
      return {
        items: ranks,
        hasMore: ranks.length === realTake ? true : false,
      };
    }
    const end = new Date(createdAt.setDate(createdAt.getDate() - td));
    const endRanks = await Rank.findByIds(
      ranks.map((rank) => {
        return { userId: rank.userId, createdAt: end };
      })
    );
    if (!endRanks.length) {
      return {
        items: ranks,
        hasMore: ranks.length === realTake ? true : false,
      };
    }
    ranks.forEach((rank) => {
      rank.totalPoints -= endRanks.filter(
        (endRank) => endRank.userId === rank.userId
      )[0].totalPoints;
    });
    const sortedRanks = ranks.sort((x, y) => y.totalPoints - x.totalPoints);
    sortedRanks.forEach((item, idx) => (item.rank = idx));
    return {
      items: sortedRanks,
      hasMore: ranks.length === realTake ? true : false,
    };
  }
}
