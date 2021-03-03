import { ServerContext } from "src/ServerContext";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { getConnection } from "typeorm";
import { Follow } from "../../follow/entities/Follow";
import { Rank } from "../../rank/entities/Rank";
import { User } from "../entities/User";

// const actionToPoints: Record<string, number> = {
//   memeVoteGiven: 1,
//   memeUpvoteRecieved: 10,
//   memeDownvoteRecieved: -12,
//   memeCommentRecieved: 2,
//   commentVoteGiven: 1,
//   commentUpvoteRecieved: 5,
//   commentDownvoteRecieved: -6,
//   followRecieved: 7,
// };

@Resolver(User)
export class UserFieldResolver {
  @FieldResolver(() => Boolean)
  async isFollowing(
    @Root() user: User,
    @Ctx() { req: { session }, isFollowingLoader }: ServerContext
  ): Promise<boolean> {
    return isFollowingLoader.load({
      followerId: session.userId,
      followingId: user.id,
    });
  }

  @FieldResolver(() => [User])
  async followers(@Root() user: User) {
    return await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .innerJoin(Follow, "follow", "follow.followerId = user.id")
      .where("follow.followingId = :userId", { userId: user.id })
      .getMany();
  }

  @FieldResolver(() => [User])
  async following(@Root() user: User) {
    return await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .innerJoin(Follow, "follow", "follow.followingId = user.id")
      .where("follow.followerId = :userId", { userId: user.id })
      .getMany();
  }

  @FieldResolver(() => Rank)
  async rank(@Root() user: User) {
    const createdAt = new Date(new Date().setMinutes(0, 0, 0));
    return await Rank.findOne({
      createdAt,
      userId: user.id,
      timeFrame: "ever",
    });
  }
}
