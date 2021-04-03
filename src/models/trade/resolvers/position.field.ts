import { FieldResolver, Int, Resolver, Root } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { TradeRepo } from "../repos/TradeRepo";
import { Position } from "../_types";

@Resolver(Position)
export class PositionFieldResolver {
  @InjectRepository(TradeRepo)
  private readonly marketRepo: TradeRepo;

  @FieldResolver(() => Int)
  async currentPrice(@Root() position: Position): Promise<number | undefined> {
    const currentPrice = await this.marketRepo.currentPrice(position.name);
    return currentPrice ? currentPrice : 0;
  }
}
