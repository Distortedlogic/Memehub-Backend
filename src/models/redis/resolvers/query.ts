import { Ctx, Int, Query, Resolver } from "type-graphql";
import { ServerContext } from "./../../../ServerContext";
import { GasPrices } from "./../_types";

@Resolver()
export class RedisResolver {
  @Query(() => GasPrices)
  async gasPrices(@Ctx() { redis }: ServerContext): Promise<GasPrices> {
    const jsonString = await redis.get("gasPrices");
    if (jsonString) {
      return JSON.parse(jsonString);
    } else {
      throw new Error("missing from redis");
    }
  }

  @Query(() => Int)
  async currentSeason(@Ctx() { getSeason }: ServerContext): Promise<number> {
    return getSeason();
  }
}
