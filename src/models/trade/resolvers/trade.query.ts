import { Arg, Int, Query, Resolver } from "type-graphql";
import { Trade } from "../entities/Trade";
import { PaginatedPositions } from "../_types";
import { PaginatedTrades } from "./../_types";

@Resolver(Trade)
export class TradeQueryResolver {
  // @InjectRepository(TradeRepo)
  // private readonly tradeRepo: TradeRepo;
  @Query(() => PaginatedTrades)
  async history(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("userId") userId: string
  ): Promise<PaginatedPositions> {
    const realTake = Math.min(50, take);
    const trades = await Trade.find({
      where: { userId },
      order: { createdAt: "DESC" },
      skip,
      take,
    });
    return {
      items: trades,
      hasMore: trades.length === realTake ? true : false,
    };
  }
}
