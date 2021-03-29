import { Resolver } from "type-graphql";
import { Trade } from "./../entities/Trade";

@Resolver(Trade)
export class TradeQueryResolver {
  // @InjectRepository(TradeRepo)
  // private readonly tradeRepo: TradeRepo;
}
