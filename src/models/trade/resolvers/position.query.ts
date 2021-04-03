import { Arg, Int, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Trade } from "../entities/Trade";
import { PaginatedPositions } from "../_types";
import { Position } from "./../_types";

@Resolver(Position)
export class PositionQueryResolver {
  // @InjectRepository(TradeRepo)
  // private readonly tradeRepo: TradeRepo;
  @Query(() => PaginatedPositions)
  async positions(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("userId") userId: string
  ): Promise<PaginatedPositions> {
    const realTake = Math.min(50, take);
    const notClosed: {
      position: number;
      name: string;
    }[] = await getConnection()
      .getRepository(Trade)
      .createQueryBuilder("trade")
      .select("trade.name", "name")
      .addSelect(
        "SUM(CASE WHEN trade.type = 'buy' THEN trade.position ELSE -trade.position END)",
        "position"
      )
      .groupBy("trade.name")
      .where("trade.userId=:userId", { userId })
      .orderBy(
        "SUM(CASE WHEN trade.type = 'buy' THEN trade.position ELSE -trade.position END)",
        "DESC"
      )
      .having(
        "SUM(CASE WHEN trade.type = 'buy' THEN trade.position ELSE -trade.position END) > 0"
      )
      .limit(take)
      .offset(skip)
      .getRawMany();
    const entryPrices = await Promise.all(
      notClosed.map(async (position) => {
        const trades = await Trade.find({
          where: { userId, name: position.name, type: "buy" },
          order: { createdAt: "ASC" },
          take: position.position,
        });
        const finalTrade = trades.reduce(
          (prev, next) => {
            if (prev.position + next.position > position.position) {
              const needed = position.position - prev.position;
              prev.position += needed;
              prev.total += needed * next.price;
              return prev;
            }
            prev.total += next.price * next.position;
            prev.position += next.position;
            return prev;
          },
          { position: 0, total: 0 }
        );
        return {
          name: position.name,
          position: finalTrade.position,
          price: Math.round(finalTrade.total / finalTrade.position),
        };
      })
    );
    return {
      items: entryPrices,
      hasMore: entryPrices.length === realTake ? true : false,
    };
  }
}
