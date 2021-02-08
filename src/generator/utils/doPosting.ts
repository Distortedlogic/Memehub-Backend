import dayjs from "dayjs";
import faker from "faker";
import random from "random";
import { Connection } from "typeorm";
import { Meme } from "../../models/meme/entities/Meme";
export const doPosting = async (
  conn: Connection,
  urls: string[],
  userId: string,
  current: dayjs.Dayjs
) => {
  const memes = urls.map((url) => ({
    url,
    userId,
    isHive: false,
    title: faker.lorem.text(random.int(0, 5)),
    community: ["original", "hive", "wholesome", "dark", "political", "none"][
      random.int(0, 5)
    ],
    createdAt: current.set("m", random.int(0, 59)).toDate(),
  }));
  await conn.createQueryBuilder().insert().into(Meme).values(memes).execute();
};
