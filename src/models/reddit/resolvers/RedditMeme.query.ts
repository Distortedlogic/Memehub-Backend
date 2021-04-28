import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { ServerContext } from "../../../ServerContext";
import { Investment } from "../../investment/entities/Investment";
import { RedditMeme } from "../entities/RedditMeme";
import { PaginatedRedditMemes } from "../_types";

@Resolver(RedditMeme)
export class MemeQueryResolver {
  @Query(() => PaginatedRedditMemes)
  async latestReddit(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("view", () => String) view: string
  ): Promise<PaginatedRedditMemes> {
    const realTake = Math.min(50, take);
    const memesQ = getConnection()
      .getRepository(RedditMeme)
      .createQueryBuilder("redditMeme")
      .select("redditMeme")
      .orderBy("redditMeme.timestamp", "DESC")
      .where("redditMeme.percentile IS NOT NULL")
      .skip(skip)
      .take(realTake);
    if (view === "investable") {
      const investments = await Investment.find({
        where: { userId: session.userId },
      });
      if (investments.length !== 0) {
        memesQ.andWhere('"redditMeme".reddit_id NOT IN (:...redditIds)', {
          redditIds: investments.map((investment) => investment.redditId),
        });
      }
    } else if (view === "investments") {
      const investments = await Investment.find({
        where: { userId: session.userId },
      });
      memesQ.andWhere('"redditMeme".reddit_id IN (:...redditIds)', {
        redditIds: investments.map((investment) => investment.redditId),
      });
    }
    const memes = await memesQ.getMany();
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }
}
