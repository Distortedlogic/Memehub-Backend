import IORedis from "ioredis";
import { getConnection } from "typeorm";
import { createRedisConnection } from "./../connections/redisConn";
import { Investment } from "./../models/investment/entities/Investment";

export const setSeasonRedis = async (redis: IORedis.Redis) => {
  const { season } = await getConnection()
    .getRepository(Investment)
    .createQueryBuilder("investment")
    .select("MAX(investment.season)", "season")
    .getRawOne();
  const redisSeason = await redis.get("season:current");
  if (redisSeason && season && parseInt(redisSeason) !== season) {
    await redis.set("season:current", season);
  } else if (!redisSeason) {
    await redis.set("season:current", season ? season : 1);
  }
};

export const getSeasonFN = (redis: IORedis.Redis) => {
  return async () => {
    const seasonStr = await redis.get("season:current");
    if (seasonStr) return parseInt(seasonStr);
    else {
      throw new Error("season not set");
    }
  };
};

export const incrementSeason = async () => {
  const redis = await createRedisConnection();
  const redisSeason = await redis.get("season:current");
  if (redisSeason) {
    await redis.set("season:current", parseInt(redisSeason) + 1);
  }
};
