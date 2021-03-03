import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../../ServerContext";
import { User } from "../../user/entities/User";
import { Rank } from "../entities/Rank";

@Resolver(Rank)
export class MemeFieldResolver {
  @FieldResolver(() => User)
  async user(@Root() rank: Rank, @Ctx() { userByIdLoader }: ServerContext) {
    return userByIdLoader.load(rank.userId);
  }
}
