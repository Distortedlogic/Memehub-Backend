import { Ctx, FieldResolver, Int, Resolver, Root } from "type-graphql";
import { Stonk } from "../_types";
import { ServerContext } from "./../../../ServerContext";
import { Trade } from "./../../trade/entities/Trade";

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

@Resolver(Stonk)
export class UserFieldResolver {
  @FieldResolver(() => Int)
  async position(
    @Root() stonk: Stonk,
    @Ctx() { req: { session } }: ServerContext
  ): Promise<number | undefined> {
    const trades = await Trade.find({
      where: { userId: session.userId, name: stonk.name },
    });
    return trades.reduce((prev, next) => {
      if (next.type === "buy") {
        prev += next.position;
      } else {
        prev -= next.position;
      }
      return prev;
    }, 0);
  }
}
