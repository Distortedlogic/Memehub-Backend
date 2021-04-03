import { FieldResolver, Int, Resolver, Root } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Trade } from "../entities/Trade";
import { TradeRepo } from "../repos/TradeRepo";

@Resolver(Trade)
export class TradeFieldResolver {
  @InjectRepository(TradeRepo)
  private readonly marketRepo: TradeRepo;
  @FieldResolver(() => Int)
  async currentPrice(@Root() trade: Trade): Promise<number | undefined> {
    const currentPrice = await this.marketRepo.currentPrice(trade.name);
    return currentPrice ? currentPrice : 0;
  }
}
