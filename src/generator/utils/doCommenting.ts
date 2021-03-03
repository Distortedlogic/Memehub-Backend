import dayjs from "dayjs";
import faker from "faker";
import random from "random";
import { Connection } from "typeorm";
import { Comment } from "../../models/comment/entities/Comment";
import { Meme } from "../../models/meme/entities/Meme";
import { settings } from "./../settings";
export const doCommenting = async (
  conn: Connection,
  userId: string,
  current: dayjs.Dayjs
) => {
  const memes: string[] = (
    await conn
      .createQueryBuilder()
      .select("meme.id", "id")
      .from(Meme, "meme")
      .orderBy("RANDOM()")
      .take(settings.numToComment)
      .getRawMany()
  ).map((meme) => meme.id);
  conn
    .createQueryBuilder()
    .insert()
    .into(Comment)
    .values(
      memes.map((memeId) => {
        return {
          userId,
          memeId,
          text: faker.lorem.text(random.int(1, 5)),
          createdAt: current.set("m", random.int(0, 59)).toDate(),
        };
      })
    )
    .execute();
};
