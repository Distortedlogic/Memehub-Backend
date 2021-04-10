import dayjs from "dayjs";
import { Arg, Int, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MarketData } from "../_types";
import { MarketRepo } from "./../repos/MarketData";

@Resolver(MarketData)
export class MarketDataQueryResolver {
  @InjectRepository(MarketRepo)
  private readonly marketRepo: MarketRepo;

  @Query(() => [MarketData])
  async marketHistory(
    @Arg("name") name: string,
    @Arg("take", () => Int) take: number
  ): Promise<MarketData[]> {
    const createdAt = dayjs()
      .set("h", 0)
      .set("m", 0)
      .set("s", 0)
      .set("ms", 0)
      .subtract(take - 1, "d");
    const realTake = Math.min(50, take);
    const marketData = await Promise.all(
      Array.from(Array(realTake).keys()).map(
        async (idx) =>
          await this.marketRepo.getMarketData(name, createdAt.add(idx, "d"))
      )
    );
    return marketData;
  }
}
