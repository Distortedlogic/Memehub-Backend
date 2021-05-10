import dayjs from "dayjs";
import { Arg, Ctx, Int, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Investment } from "../entities/Investment";
import { Auth } from "./../../../middleware/auth";
import { ServerContext } from "./../../../ServerContext";
import { User } from "./../../user/entities/User";
import { InvestmentStats, UserInvestmentStats } from "./../_types";

@Resolver()
export class InvestmentStatsQueryResolver {
  @Query(() => UserInvestmentStats, { nullable: true })
  @UseMiddleware(Auth)
  async userInvestmentStats(
    @Arg("userId", () => String) userId: string,
    @Arg("timeframe", () => String) timeframe: string,
    @Arg("typeFilter", () => String) typeFilter: string,
    @Arg("season", () => Int) season: number
  ): Promise<UserInvestmentStats> {
    const investmentsQ = getConnection()
      .getRepository(Investment)
      .createQueryBuilder("investment")
      .select(
        "CASE WHEN COUNT(investment.id)=0 THEN 0 ELSE MAX(investment.profitLoss) END",
        "bestTrade"
      )
      .addSelect(
        "CASE WHEN COUNT(investment.id)=0 THEN 0 ELSE MIN(investment.profitLoss) END",
        "worstTrade"
      )
      .addSelect(
        "CASE WHEN COUNT(investment.id)=0 THEN 0 ELSE SUM(investment.profitLoss) END",
        "profitLoss"
      )
      .addSelect("COUNT(investment.id)", "count")
      .addSelect(
        "CASE WHEN COUNT(investment.id)=0 THEN 0 ELSE SUM(CASE WHEN investment.profitLoss > 0 THEN 1 ELSE 0 END) END",
        "numGoodTrades"
      )
      .addSelect("COUNT(investment.id)", "numTrades")
      .where("investment.userId=:userId", { userId })
      .andWhere("investment.season = :season", { season });
    if (timeframe === "daily") {
      investmentsQ.andWhere("investment.createdAt > :time", {
        time: dayjs().subtract(1, "d").toDate(),
      });
    } else if (timeframe === "weekly") {
      investmentsQ.andWhere("investment.createdAt > :time", {
        time: dayjs().subtract(7, "d").toDate(),
      });
    }
    if (typeFilter === "invest") {
      investmentsQ.andWhere("investment.type = :type", { type: "invest" });
    } else if (typeFilter === "short") {
      investmentsQ.andWhere("investment.type = :type", { type: "short" });
    }
    return investmentsQ.getRawOne();
  }

  @Query(() => InvestmentStats)
  @UseMiddleware(Auth)
  async investmentStats(
    @Ctx() { getSeason }: ServerContext
  ): Promise<InvestmentStats> {
    const { maxProfitLoss } = await getConnection()
      .getRepository(Investment)
      .createQueryBuilder("investment")
      .select(
        "CASE WHEN COUNT(investment) != 0 THEN MAX(investment.profitLoss) ELSE 0 END",
        "maxProfitLoss"
      )
      .where("investment.season = :season", {
        season: await getSeason(),
      })
      .getRawOne();
    const { maxYolo } = await getConnection()
      .getRepository(Investment)
      .createQueryBuilder("investment")
      .select(
        "CASE WHEN COUNT(investment) != 0 THEN MAX(investment.betSize) ELSE 0 END",
        "maxYolo"
      )
      .where("investment.season = :season", {
        season: await getSeason(),
      })
      .andWhere("investment.isYolo = TRUE")
      .getRawOne();
    const bestTrade = await getConnection()
      .getRepository(Investment)
      .createQueryBuilder("investment")
      .select("investment")
      .where("investment.profitLoss=:maxProfitLoss", { maxProfitLoss })
      .andWhere("investment.season = :season", {
        season: await getSeason(),
      })
      .leftJoinAndSelect("investment.user", "user", "investment.userId=user.id")
      .groupBy("investment.id")
      .addGroupBy("user.id")
      .getOne();
    const largestYolo = await getConnection()
      .getRepository(Investment)
      .createQueryBuilder("investment")
      .select("investment")
      .where("investment.betSize=:maxYolo", { maxYolo })
      .where("investment.isYolo = TRUE")
      .andWhere("investment.season = :season", {
        season: await getSeason(),
      })
      .leftJoinAndSelect("investment.user", "user", "investment.userId=user.id")
      .groupBy("investment.id")
      .addGroupBy("user.id")
      .getOne();
    const rankQ = getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .select("user.id", "id")
      .addSelect("user.username", "username")
      .addSelect("user.avatar", "avatar")
      .leftJoinAndSelect(
        "user.investments",
        "investment",
        "investment.userId=user.id"
      )
      .addSelect(
        "CASE WHEN COUNT(investment) != 0 THEN SUM(investment.profitLoss) ELSE 0 END",
        "profitLoss"
      )
      .where("investment.season = :season", {
        season: await getSeason(),
      })
      .groupBy("user.id")
      .addGroupBy("investment.id")
      .orderBy(
        "CASE WHEN COUNT(investment) != 0 THEN SUM(investment.profitLoss) ELSE 0 END"
      )
      .limit(3);
    return {
      bestTrade,
      largestYolo,
      daily: await rankQ
        .where("investment.createdAt > :time", {
          time: dayjs().subtract(1, "d"),
        })
        .getRawMany(),
      weekly: await rankQ
        .where("investment.createdAt > :time", {
          time: dayjs().subtract(7, "d"),
        })
        .getRawMany(),
      season: await rankQ.getRawMany(),
    };
  }
}
