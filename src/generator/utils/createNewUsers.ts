import dayjs from "dayjs";
import faker from "faker";
import random from "random";
import { Connection } from "typeorm";
import { User } from "../../models/user/User.entity";
import { settings } from "../settings";

export const createNewUsers = async (
  conn: Connection,
  current: dayjs.Dayjs
) => {
  const users = Array(settings.numUsersToCreate)
    .fill(settings.numUsersToCreate)
    .map(() => ({
      isHive: random.boolean(),
      verified: true,
      avatar: faker.image.avatar(),
      createdAt: current
        .set("m", random.int(0, 59))
        .set("ms", random.int(0, 999))
        .toDate(),
      username: faker.internet.userName(),
    }));
  await conn.createQueryBuilder().insert().into(User).values(users).execute();
};
