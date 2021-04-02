import dayjs from "dayjs";
import { getConnection } from "typeorm";
import { RedditMeme } from "./../models/reddit/entities/RedditMeme";
import { Market } from "./../models/stonkMarket/entities/Market";
import { Template } from "./../models/stonkMarket/entities/Template";
export const recordMarket = async () => {
  const createdAt = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0);
  for (const template of await Template.find()) {
    const { name } = template;
    const redditMarket = await getConnection()
      .getRepository(RedditMeme)
      .createQueryBuilder("RedditMeme")
      .select("SUM(RedditMeme)", "numPosts")
      .addSelect("SUM(RedditMeme.upvotes)", "numUpvotes")
      .where("RedditMeme.meme_clf = :name", { name })
      .andWhere("RedditMeme.createdAt > :start", {
        start: createdAt.subtract(2, "d"),
      })
      .andWhere("RedditMeme.createdAt <= :end", {
        end: createdAt.subtract(1, "d"),
      })
      .groupBy("RedditMeme.subreddit")
      .getRawOne();
    await Market.create({
      numPosts: redditMarket.numPosts,
      numUpvotes: redditMarket.numUpvotes,
      createdAt,
      name,
    }).save();
  }
};
