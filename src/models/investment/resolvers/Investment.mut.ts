import {
  Arg,
  Ctx,
  Float,
  Int,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Auth } from "./../../../middleware/auth";
import { ServerContext } from "./../../../ServerContext";
import { User } from "./../../user/entities/User";
import { Investment } from "./../entities/Investment";

@Resolver(Investment)
export class MemeResolver {
  @Mutation(() => Investment, { nullable: true })
  @UseMiddleware(Auth)
  async invest(
    @Arg("betsize", () => Int) betSize: number,
    @Arg("odds", () => Float) odds: number,
    @Arg("redditId", () => Float) redditId: string,
    @Ctx() { req: { session } }: ServerContext
  ): Promise<Investment | undefined> {
    const user = await User.findOne(session.userId);
    if (user) {
      return Investment.create({
        user,
        userId: session.userId,
        betSize,
        odds,
        redditId,
      }).save();
    } else {
      return undefined;
    }
  }
}
