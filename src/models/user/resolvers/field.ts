import { FieldResolver, Resolver, Root } from "type-graphql";
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
  @FieldResolver(() => Rank)
  async rank(@Root() user: User): Promise<Rank | undefined> {
    const createdAt = new Date(new Date().setMinutes(0, 0, 0));
    return Rank.findOne({
      createdAt,
      userId: user.id,
      timeFrame: "ever",
    });
  }
}
