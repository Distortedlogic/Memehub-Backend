import dayjs from "dayjs";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { ServerContext } from "../../../ServerContext";
import { MARKET_AGG_PERIOD } from "../../../utils/constants";
import { Trade } from "../../trade/entities/Trade";
import { Template } from "../entities/Template";
import { PaginatedStonks, Stonk } from "../_types";

@Resolver(Stonk)
export class StonkQueryResolver {
  // @InjectRepository(MarketRepo)
  // private readonly marketRepo: MarketRepo;

  @Query(() => PaginatedStonks)
  async stonks(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("onlyPositions", () => Boolean, { nullable: true })
    onlyPositions?: boolean,
    @Arg("order", () => String, { nullable: true }) order?: string,
    @Arg("take", () => Int, { nullable: true }) take?: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
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
        start: createdAt.subtract(MARKET_AGG_PERIOD, "d").toDate(),
      });
    if (order && skip && take) {
      stonksq.offset(skip).limit(take);
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
    } else {
      const stonks: Stonk[] = await stonksq.getRawMany();
      return { hasMore: false, items: stonks };
    }
  }
}
