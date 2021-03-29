import dayjs from "dayjs";
import { getConnection } from "typeorm";
import { Meme } from "./../models/meme/entities/Meme";
import { RedditMeme } from "./../models/reddit/entities/RedditMeme";
import { Market } from "./../models/stonkMarket/entities/Market";
import { Template } from "./../models/stonkMarket/entities/Template";
export const recordMarket = async () => {
  const createdAt = dayjs().set("m", 0).set("ms", 0);
  for (const template of await Template.find()) {
    const { name } = template;
    const redditMarket = await getConnection()
      .getRepository(RedditMeme)
      .createQueryBuilder("RedditMeme")
      .select("SUM(RedditMeme)", "numPosts")
      .addSelect("SUM(RedditMeme.upvotes)", "numUpvotes")
      .addSelect("RedditMeme.subreddit", "subreddit")
      .where("RedditMeme.meme_clf = :name", { name })
      .where("RedditMeme.createdAt BETWEEN :start AND :end", {
        start: createdAt.subtract(1, "d"),
        end: createdAt,
      })
      .groupBy("RedditMeme.subreddit")
      .getRawOne();
    await Market.create({
      numPosts: redditMarket.numPosts,
      numUpvotes: redditMarket.numUpvotes,
      createdAt,
      name,
      source: "reddit",
      subsource: redditMarket.subreddit,
    }).save();
    const siteMarket = await getConnection()
      .getRepository(Meme)
      .createQueryBuilder("meme")
      .select("SUM(meme)", "numPosts")
      .addSelect("SUM(meme.ups)", "numUpvotes")
      .where("meme.meme_clf = :name", { name })
      .andWhere("meme.createdAt BETWEEN :start AND :end", {
        start: createdAt.subtract(1, "d"),
        end: createdAt,
      })
      .getRawOne();
    await Market.create({
      numPosts: siteMarket.numPosts,
      numUpvotes: siteMarket.numUpvotes,
      createdAt,
      name,
      source: "memehub",
      subsource: "memehub",
    }).save();
  }
};
