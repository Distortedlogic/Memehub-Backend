import { Arg, Int, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { RedditMeme } from "../entities/RedditMeme";
import { RedditNew } from "./../entities/RedditNew";
import { PaginatedRedditMemes, PaginatedRedditNew } from "./../_types";

@Resolver(RedditMeme)
export class MemeQueryResolver {
  @Query(() => PaginatedRedditMemes)
  async bestOfReddit(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number
  ): Promise<PaginatedRedditMemes> {
    const realTake = Math.min(50, take);
    const memes = await getConnection()
      .getRepository(RedditMeme)
      .createQueryBuilder("redditMeme")
      .select("redditMeme")
      .orderBy("redditMeme.upvotes", "DESC")
      .skip(skip)
      .take(realTake)
      .getMany();
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }
  @Query(() => PaginatedRedditNew)
  async redditNew(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number
  ): Promise<PaginatedRedditNew> {
    const realTake = Math.min(50, take);
    const memes = await RedditNew.find({ take: realTake, skip });
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }
}
