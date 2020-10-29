import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Auth } from "./../../middleware/auth";
import { ServerContext } from "./../../ServerContext";
import { Follow } from "./Follow.entity";

@Resolver(Follow)
export class FollowMutationResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async follow(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("userId") userId: string
  ): Promise<boolean> {
    if (
      await Follow.findOne({ followerId: session.userId, followingId: userId })
    )
      return false;
    await Follow.create({
      followerId: session.userId,
      followingId: userId,
    }).save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async unfollow(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("userId") userId: string
  ): Promise<boolean> {
    const follow = await Follow.findOne({
      followerId: session.userId,
      followingId: userId,
    });
    if (!follow) return false;
    await Follow.remove(follow);
    return true;
  }
}
