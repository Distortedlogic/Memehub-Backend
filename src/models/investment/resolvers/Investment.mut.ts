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
import { RedditMeme } from "./../../reddit/entities/RedditMeme";
import { User } from "./../../user/entities/User";
import { Investment } from "./../entities/Investment";

@Resolver(Investment)
export class MemeResolver {
  @Mutation(() => Investment, { nullable: true })
  @UseMiddleware(Auth)
  async invest(
    @Ctx() { req: { session }, getSeason }: ServerContext,
    @Arg("betSize", () => Int) betSize: number,
    @Arg("redditId", () => String) redditId: string,
    @Arg("type", () => String) type: string,
    @Arg("target", () => Float, { nullable: true }) target?: number
  ): Promise<Investment | undefined> {
    const season = await getSeason();
    const user = await User.findOne(session.userId);
    const redditMeme = await RedditMeme.findOne({ where: { redditId } });
    if (
      user &&
      redditMeme &&
      ((type === "invest" && target && target >= 0.5 && target < 1) ||
        type === "short")
    ) {
      if (user.gbp >= betSize) {
        const isYolo = betSize === user.gbp;
        const profitLoss =
          type === "invest"
            ? redditMeme.percentile >= target!
              ? Math.round((betSize * target!) / (1 - target!)) *
                (isYolo ? 2 : 1)
              : -betSize
            : redditMeme.percentile < 0.5
            ? betSize * (isYolo ? 2 : 1)
            : -Math.min(
                user.gbp,
                Math.round(
                  (betSize * redditMeme.percentile) /
                    (1 - redditMeme.percentile)
                )
              );
        user.gbp += profitLoss;
        await User.save(user);
        return Investment.create({
          user,
          userId: session.userId,
          betSize,
          percentile: redditMeme.percentile,
          type,
          profitLoss,
          upvotes: redditMeme.upvotes,
          target,
          redditId,
          season,
          isYolo,
        }).save();
      } else {
        throw new Error("not enough GBP");
      }
    } else {
      return undefined;
    }
  }
}
