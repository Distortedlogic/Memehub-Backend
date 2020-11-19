import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ServerContext } from "../../ServerContext";

@Resolver()
export class RedisResolver {
  @Mutation(() => String)
  async redisGet(
    @Ctx() { redis }: ServerContext,
    @Arg("key") key: string
  ): Promise<string> {
    const data = await redis.get(key);
    if (data) return data;
    else return "";
  }
}
