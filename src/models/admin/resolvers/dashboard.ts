import dayjs from "dayjs";
import { Arg, Int, Query, Resolver } from "type-graphql";
import { Between, FindOperator, getConnection, LessThanOrEqual } from "typeorm";
import { Comment } from "./../../comment/entities/Comment";
import { Meme } from "./../../meme/entities/Meme";
import { RedditMeme } from "./../../reddit/entities/RedditMeme";
import { User } from "./../../user/entities/User";

@Resolver()
export class DashboardResolver {
  @Query(() => [Int])
  async countGraph(
    @Arg("ticks", () => Int) ticks: number,
    @Arg("timeframe") timeframe: string,
    @Arg("aggro") aggro: string,
    @Arg("entityType") entityType: string
  ): Promise<number[]> {
    if (ticks <= 0 || 100 < ticks) throw new Error("bad tick number");
    if (!["day", "week", "month"].includes(timeframe))
      throw new Error("bad timeframe");
    if (!["new", "total"].includes(aggro)) throw new Error("bad aggro");
    if (!["user", "meme", "comment"].includes(entityType))
      throw new Error("bad entityType");
    const current = dayjs();
    let createdAt: (idx: number) => FindOperator<Date>;
    switch (true) {
      case aggro === "total":
        createdAt = (idx: number) =>
          LessThanOrEqual(
            current
              .subtract(idx, timeframe as "day" | "week" | "month")
              .toDate()
          );
        break;
      case aggro === "new":
        createdAt = (idx: number) =>
          Between(
            current
              .subtract(idx + 1, timeframe as "day" | "week" | "month")
              .toDate(),
            current
              .subtract(idx, timeframe as "day" | "week" | "month")
              .toDate()
          );
        break;
      default:
        break;
    }
    let counts: Promise<number>[];
    switch (true) {
      case entityType === "user":
        counts = Array.from(Array(ticks).keys()).map(async (idx) => {
          return await User.count({ where: { createdAt: createdAt(idx) } });
        });
        break;
      case entityType === "meme":
        counts = Array.from(Array(ticks).keys()).map(async (idx) => {
          return await Meme.count({ where: { createdAt: createdAt(idx) } });
        });
        break;
      case entityType === "comment":
        counts = Array.from(Array(ticks).keys()).map(async (idx) => {
          return await Comment.count({ where: { createdAt: createdAt(idx) } });
        });
        break;
      default:
        counts = [];
        break;
    }
    return (await Promise.all(counts)).reverse();
  }

  @Query(() => String)
  async redditMaxTimestamp(): Promise<String> {
    const data = await getConnection()
      .getRepository(RedditMeme)
      .createQueryBuilder("redditMeme")
      .select("MAX(redditMeme.createdAt)")
      .getRawOne();
    console.log(data.max);
    return data.max;
  }
}
