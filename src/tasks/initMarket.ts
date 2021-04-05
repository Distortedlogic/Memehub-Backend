import dayjs from "dayjs";
import { createTypeormConnection } from "./../connections/typeormConn";
import { RedditMeme } from "./../models/reddit/entities/RedditMeme";
import { Market } from "./../models/stonkMarket/entities/Market";
import { Template } from "./../models/stonkMarket/entities/Template";
export const initMarket = async () => {
  const conn = await createTypeormConnection();
  await Market.delete({});
  const templates = await Template.find();
  let createdAt = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0);
  let currentRedditTS = createdAt.subtract(1, "d");
  const min_ts = dayjs(
    (
      await conn
        .createQueryBuilder()
        .select("MIN(redditmeme.createdAt)", "data")
        .from(RedditMeme, "redditmeme")
        .where("redditmeme.meme_clf is not null")
        .getRawOne()
    ).data
  );
  while (min_ts <= createdAt.subtract(30, "d")) {
    console.log(createdAt.toDate());
    const redditMarket = await conn
      .createQueryBuilder()
      .from(RedditMeme, "redditmeme")
      .select("COUNT(redditmeme)", "numPosts")
      .addSelect("SUM(redditmeme.upvotes)", "numUpvotes")
      .addSelect("redditmeme.meme_clf", "name")
      .where("redditmeme.stonk = True")
      .groupBy("redditmeme.meme_clf")
      .andWhere("redditmeme.createdAt > :start", {
        start: currentRedditTS.subtract(1, "d").toDate(),
      })
      .andWhere("redditmeme.createdAt <= :end", {
        end: currentRedditTS.toDate(),
      })
      .getRawMany();
    for (const template of templates) {
      const { name } = template;
      const marketData = redditMarket.filter((item) => item.name === name)[0];
      await Market.create({
        numPosts: marketData?.numPosts ? marketData.numPosts : 0,
        numUpvotes: marketData?.numUpvotes ? marketData.numUpvotes : 0,
        createdAt,
        name,
        templateId: template.id,
        template,
      }).save();
    }
    createdAt = createdAt.subtract(1, "d");
    currentRedditTS = currentRedditTS.subtract(1, "d");
  }
};
initMarket();
