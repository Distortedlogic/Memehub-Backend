import { Connection } from "typeorm";
import { RedditMeme } from "../../models/reddit/entities/RedditMeme";

export const getRedditMemes = async (conn: Connection): Promise<string[]> => {
  return (
    await conn
      .createQueryBuilder()
      .select("redditMeme.url", "url")
      .from(RedditMeme, "redditMeme")
      .orderBy("redditMeme.upvotes", "DESC")
      .getRawMany()
  ).map((redditMeme) => redditMeme.url);
};
