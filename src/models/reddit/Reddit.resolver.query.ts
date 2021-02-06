import { Arg, Int, ObjectType, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { PaginatedResponse } from "../../utils/types";
import { RedditMeme } from "./RedditMeme.entity";

@ObjectType()
export class PaginatedRedditMemes extends PaginatedResponse(RedditMeme) {}

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

  @Query(() => String)
  async redditMaxTimestamp(): Promise<String> {
    const data = await getConnection()
      .getRepository(RedditMeme)
      .createQueryBuilder("redditMeme")
      .select("MAX(redditMeme.createdAt)")
      .getRawOne();
    console.log(data.max);
    return data.max;
  }
}
