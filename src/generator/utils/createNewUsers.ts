import dayjs from "dayjs";
import faker from "faker";
import random from "random";
import { Connection } from "typeorm";
import { settings } from "../settings";
import { User } from "./../../models/user/entities/User";
import { randomIntFromInterval } from "./utils";

export const createNewUsers = async (
  conn: Connection,
  current: dayjs.Dayjs
) => {
  const users = Array.from(
    Array(randomIntFromInterval(0, settings.numUsersToCreate)).keys()
  ).map(() => ({
    isHive: random.boolean(),
    verified: true,
    avatar: faker.image.avatar(),
    createdAt: current
      .set("m", random.int(0, 59))
      .set("ms", random.int(0, 999))
      .toDate(),
    username: faker.internet.userName(),
  }));
  if (users.length) {
    await conn.createQueryBuilder().insert().into(User).values(users).execute();
  }
};
