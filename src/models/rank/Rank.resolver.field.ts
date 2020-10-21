import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ServerContext } from "../../ServerContext";
import { User } from "../user/User.entity";
import { Rank } from "./Rank.entity";

@Resolver(Rank)
export class MemeFieldResolver {
  @FieldResolver(() => User)
  async user(@Root() rank: Rank, @Ctx() { userByIdLoader }: ServerContext) {
    return userByIdLoader.load(rank.userId);
  }
}
