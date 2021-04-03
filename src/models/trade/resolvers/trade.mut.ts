import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Auth } from "../../../middleware/auth";
import { ServerContext } from "../../../ServerContext";
import { Template } from "../../stonkMarket/entities/Template";
import { User } from "../../user/entities/User";
import { Trade } from "../entities/Trade";
import { TradeRepo } from "./../repos/TradeRepo";

@Resolver(Trade)
export class MarketQueryResolver {
  @InjectRepository(TradeRepo)
  private readonly tradeRepo: TradeRepo;
  @Mutation(() => Trade, { nullable: true })
  @UseMiddleware(Auth)
  async makeTrade(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("name") name: string,
    @Arg("type") type: string,
    @Arg("position", () => Int) position: number
  ): Promise<Trade | undefined> {
    const userId: string = session.userId;
    const user = await User.findOne(userId);
    const price = await this.tradeRepo.currentPrice(name);
    if (price && user?.gbp! > position * price) {
      const trade = await Trade.create({
        name,
        position,
        price,
        type,
        userId,
        template: await Template.findOne({ where: { name } }),
      }).save();
      return trade;
    }
    return;
  }
}
