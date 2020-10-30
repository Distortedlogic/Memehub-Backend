import { Arg, Int, Query, Resolver } from "type-graphql";
import { Equal, Not } from "typeorm";
import { Rank } from "./Rank.entity";
import { PaginatedRanks } from "./_types";

@Resolver(Rank)
export class RankQueryResolver {
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
