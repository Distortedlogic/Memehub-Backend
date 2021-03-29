import dayjs from "dayjs";
import { Arg, Int, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Market } from "../entities/Market";
import { Template } from "./../entities/Template";
import { MarketRepo } from "./../repos/Market";
import { PaginatedStonks, Stonk } from "./../_types";

@Resolver(Market)
export class MarketQueryResolver {
  @InjectRepository(MarketRepo)
  private readonly marketRepo: MarketRepo;

  @Query(() => PaginatedStonks)
  async stonks(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order") order: string
  ): Promise<PaginatedStonks> {
    console.log(order);
    const createdAt = dayjs().set("h", 0).set("m", 0).set("ms", 0);
    const templates = await Template.find({ take, skip });
    const stonks = await Promise.all(
      templates.map(async (template) => {
        const marketData = await this.marketRepo.getMarketData(
          template.name,
          createdAt
        );
        return { ...template, ...marketData } as Stonk;
      })
    );
    return { hasMore: true, items: stonks };
  }
}
