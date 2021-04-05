import dayjs from "dayjs";
import { Arg, Int, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MarketData } from "../_types";
import { MarketRepo } from "./../repos/MarketData";
import { PaginatedMarketData } from "./../_types";

@Resolver(MarketData)
export class MarketDataQueryResolver {
  @InjectRepository(MarketRepo)
  private readonly marketRepo: MarketRepo;

  @Query(() => PaginatedMarketData)
  async marketHistory(
    @Arg("name") name: string,
    @Arg("take", () => Int) take: number
  ): Promise<PaginatedMarketData> {
    const createdAt = dayjs()
      .set("h", 0)
      .set("m", 0)
      .set("s", 0)
      .set("ms", 0)
      .subtract(take - 1, "d");
    const realTake = Math.min(50, take);
    const marketData = await Promise.all(
      Array.from(Array(take).keys()).map(
        async (idx) =>
          await this.marketRepo.getMarketData(name, createdAt.add(idx, "d"))
      )
    );
    return {
      items: marketData,
      hasMore: marketData.length === realTake ? true : false,
    };
  }
}
