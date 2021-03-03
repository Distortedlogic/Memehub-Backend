import dayjs from "dayjs";
import random from "random";
import { Connection } from "typeorm";
import { settings } from "../settings";
import { Follow } from "./../../models/follow/entities/Follow";
import { User } from "./../../models/user/entities/User";

export const doFollowing = async (
  conn: Connection,
  userId: string,
  current: dayjs.Dayjs
) => {
  const following: string[] = (
    await conn
      .createQueryBuilder()
      .select("follow.followingId", "userId")
      .from(Follow, "follow")
      .where("follow.followerId=:userId", { userId })
      .getRawMany()
  ).map((follow) => follow.userId);
  let q = conn
    .createQueryBuilder()
    .select("user.id", "userId")
    .from(User, "user")
    .take(settings.numToFollow);
  if (following.length !== 0) {
    q = q.where("user.id NOT IN (:...following)", { following: following });
  }
  const followable = (await q.getRawMany()).map((follow) => follow.userId);
  const follows = followable.map((followingId) => ({
    followingId,
    followerId: userId,
    createdAt: current.set("m", random.int(0, 59)).toDate(),
  }));
  await conn
    .createQueryBuilder()
    .insert()
    .into(Follow)
    .values(follows)
    .execute();
};
