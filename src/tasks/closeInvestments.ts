import dayjs from "dayjs";
import { Between } from "typeorm";
import { RedditMeme } from "./../models/reddit/entities/RedditMeme";

export const closeInvestments = async () => {
  const now = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0).subtract(1, "d");
  const redditMemes = await RedditMeme.find({
    where: { createdAt: Between(now.subtract(1, "d"), now) },
  });
};
