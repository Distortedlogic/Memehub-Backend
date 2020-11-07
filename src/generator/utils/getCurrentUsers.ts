import { Connection } from "typeorm";
import { User } from "../../models/user/User.entity";

export const getCurrentUsers = async (conn: Connection) => {
  const numUsers = await conn
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .getCount();
  return (
    await conn
      .createQueryBuilder()
      .select("user.id", "userId")
      .from(User, "user")
      .orderBy("RANDOM()")
      .take(Math.ceil(numUsers / (2 * 24)))
      .getRawMany()
  ).map((follow) => follow.userId);
};
