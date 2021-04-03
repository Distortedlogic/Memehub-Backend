import dayjs from "dayjs";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Market } from "../entities/Market";
import { ServerContext } from "./../../../ServerContext";
import { Trade } from "./../../trade/entities/Trade";
import { Template } from "./../entities/Template";
import { PaginatedStonks, Stonk } from "./../_types";

@Resolver(Market)
export class MarketQueryResolver {
  // @InjectRepository(MarketRepo)
  // private readonly marketRepo: MarketRepo;

  @Query(() => PaginatedStonks)
  async stonks(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("onlyPositions", () => Boolean) onlyPositions: boolean,
    @Arg("order") order: string
  ): Promise<PaginatedStonks> {
    const createdAt = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0);
    const stonksq = getConnection()
      .getRepository(Template)
      .createQueryBuilder("template")
      .select("template.name", "name")
      .addSelect("template.url", "url")
      .leftJoin("template.marketData", "market")
      .groupBy("template.id")
      .addGroupBy("market.templateId")
      .addSelect("SUM(market.numPosts)", "numPosts")
      .addSelect("SUM(market.numUpvotes)", "marketcap")
      .addSelect(
        "CASE WHEN SUM(market.numPosts) != 0 THEN SUM(market.numUpvotes)/SUM(market.numPosts) ELSE 0 END",
        "price"
      )
      .andWhere("market.createdAt >= :start", {
        start: createdAt.subtract(30, "d").toDate(),
      })
      .offset(skip)
      .limit(take);
    if (onlyPositions) {
      if (!session.userId) {
        throw new Error("not authenticated");
      }
      const positions = await getConnection()
        .getRepository(Trade)
        .createQueryBuilder("trade")
        .select("trade.name", "name")
        .groupBy("trade.name")
        .where("trade.userId=:userId", { userId: session.userId })
        .having(
          "SUM(CASE WHEN trade.type = 'buy' THEN trade.position ELSE -trade.position END) > 0"
        )
        .getRawMany();
      if (positions.length === 0) {
        return { hasMore: false, items: [] };
      }
      stonksq.andWhere("template.name IN (:...positions)", {
        positions: positions.map((position) => position.name),
      });
    }
    if (order === "price") {
      stonksq.orderBy({ price: "DESC" });
    } else if (order === "marketcap") {
      stonksq.orderBy({ marketcap: "DESC" });
    }
    const stonks: Stonk[] = await stonksq.getRawMany();
    return { hasMore: true, items: stonks };
  }
}
