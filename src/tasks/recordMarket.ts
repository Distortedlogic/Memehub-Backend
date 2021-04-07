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
      .createQueryBuilder("meme")
      .select("SUM(meme)", "numPosts")
      .addSelect("SUM(meme.upvotes)", "numUpvotes")
      .where("meme.meme_clf = :name", { name })
      .andWhere("meme.createdAt > :start", {
        start: createdAt.subtract(2, "d"),
      })
      .andWhere("meme.createdAt <= :end", {
        end: createdAt.subtract(1, "d"),
      })
      .getRawOne();
    await Market.create({
      numPosts: redditMarket.numPosts,
      numUpvotes: redditMarket.numUpvotes,
      createdAt,
      name,
      templateId: template.id,
      template,
    }).save();
  }
};
