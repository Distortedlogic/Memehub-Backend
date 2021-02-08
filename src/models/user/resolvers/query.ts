import dayjs from "dayjs";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { Between, LessThanOrEqual } from "typeorm";
import { ServerContext } from "../../../ServerContext";
import { User } from "../entities/User";

@Resolver(User)
export class UserQueryResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find({ take: 20 });
  }

  @Query(() => [Int])
  async numNewUsers(@Arg("timeframe") timeframe: string): Promise<number[]> {
    if (!["day", "week", "month"].includes(timeframe))
      throw new Error("bad timeframe");
    const current = dayjs();
    const counts = Array(10)
      .fill(10)
      .map(async (idx) => {
        return await User.count({
          where: {
            createdAt: Between(
              current
                .subtract(idx + 1, timeframe as "day" | "week" | "month")
                .toDate(),
              current
                .subtract(idx, timeframe as "day" | "week" | "month")
                .toDate()
            ),
          },
        });
      });
    return Promise.all(counts);
  }
  @Query(() => [Int])
  async numUsers(@Arg("timeframe") timeframe: string): Promise<number[]> {
    if (!["day", "week", "month"].includes(timeframe))
      throw new Error("bad timeframe");
    const current = dayjs();
    const counts = Array(10)
      .fill(10)
      .map(async (idx) => {
        return await User.count({
          where: {
            createdAt: LessThanOrEqual(
              current
                .subtract(idx, timeframe as "day" | "week" | "month")
                .toDate()
            ),
          },
        });
      });
    return Promise.all(counts);
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req: { session } }: ServerContext
  ): Promise<User | undefined> {
    if (!session.userId) return;
    return await User.findOne(session.userId);
  }
  @Query(() => User, { nullable: true })
  async user(@Arg("userId") userId: string): Promise<User | undefined> {
    return await User.findOne(userId);
  }
  @Query(() => Boolean)
  async isHive(@Ctx() { req: { session } }: ServerContext): Promise<boolean> {
    if (!session.userId) return false;
    const user = await User.findOne(session.userId);
    if (!user) {
      return false;
    }
    return user.isHive;
  }
}
