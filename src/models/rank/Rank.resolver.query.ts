import dayjs from "dayjs";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { In } from "typeorm";
import { ServerContext } from "./../../ServerContext";
import { Rank } from "./Rank.entity";
import { PaginatedRanks } from "./_types";

@Resolver(Rank)
export class RankQueryResolver {
  @Query(() => [Rank])
  async userRanks(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("userId", () => String, { nullable: true }) userId?: string,
    @Arg("timeFrame", { nullable: true }) timeFrame?: string
  ): Promise<Rank[]> {
    if (!userId) userId = session.userId;
    const current = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0);
    const times = Array(30)
      .fill(30)
      .map((_, idx) => current.subtract(idx, "d").toDate());
    return await Rank.find({
      where: { userId, createdAt: In(times), timeFrame },
      order: { createdAt: "ASC" },
    });
  }

  @Query(() => [Rank])
  async currentRanks(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("userId", () => String, { nullable: true }) userId?: string
  ): Promise<Rank[]> {
    if (!userId) userId = session.userId;
    const createdAt = dayjs().set("m", 0).set("s", 0).set("ms", 0).toDate();
    const ranks = ["ever", "day", "week", "month"].map(async (timeFrame) => {
      const rank = await Rank.findOne({
        where: { userId, createdAt, timeFrame },
      });
      return rank!;
    });
    const result = await Promise.all(ranks);
    return result;
  }

  @Query(() => PaginatedRanks)
  async ranking(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("timeFrame") timeFrame: string
  ): Promise<PaginatedRanks> {
    const realTake = Math.min(50, take);
    if (!["ever", "day", "week", "month"].includes(timeFrame))
      return { items: [], hasMore: false };
    const createdAt = dayjs().set("m", 0).set("s", 0).set("ms", 0).toDate();
    const ranks = await Rank.find({
      where: { createdAt, timeFrame },
      order: { rank: "ASC" },
      take: realTake,
      skip,
    });
    return {
      items: ranks,
      hasMore: ranks.length === realTake ? true : false,
    };
  }
}
