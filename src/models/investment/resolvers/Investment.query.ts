import dayjs from "dayjs";
import { Arg, Ctx, Int, Query, Resolver, UseMiddleware } from "type-graphql";
import { FindOneOptions, MoreThanOrEqual } from "typeorm";
import { Auth } from "./../../../middleware/auth";
import { ServerContext } from "./../../../ServerContext";
import { Investment } from "./../entities/Investment";
import { PaginatedInvestments } from "./../_types";

@Resolver(Investment)
export class InvestmentQueryResolver {
  @Query(() => PaginatedInvestments, { nullable: true })
  @UseMiddleware(Auth)
  async userInvestments(
    @Ctx() { getSeason }: ServerContext,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) orderStr: string,
    @Arg("userId", () => String) userId: string,
    @Arg("typeFilter", () => String) typeFilter: string,
    @Arg("timeframe", () => String) timeframe: string,
    @Arg("isASC", () => Boolean) isASC: boolean,
    @Arg("season", () => Int) seasonInput?: number
  ): Promise<PaginatedInvestments> {
    const realTake = Math.min(50, take);
    const currentSeason = await getSeason();
    const season = seasonInput ? seasonInput : currentSeason;
    let order: FindOneOptions<Investment>["order"];
    let where: FindOneOptions<Investment>["where"] = { season };
    if (orderStr === "createdAt") {
      order = { createdAt: !isASC ? ("DESC" as const) : ("ASC" as const) };
    } else if (orderStr === "betSize") {
      order = { betSize: !isASC ? ("DESC" as const) : ("ASC" as const) };
    } else if (orderStr === "percentile") {
      order = { percentile: !isASC ? ("DESC" as const) : ("ASC" as const) };
    } else if (orderStr === "target") {
      order = { target: !isASC ? ("DESC" as const) : ("ASC" as const) };
    } else if (orderStr === "profitLoss") {
      order = { profitLoss: !isASC ? ("DESC" as const) : ("ASC" as const) };
    }
    if (typeFilter === "invest") {
      where = { userId, type: "invest", ...where };
    } else if (typeFilter === "short") {
      where = { userId, type: "short", ...where };
    } else {
      where = { userId, ...where };
    }
    if (timeframe === "daily") {
      where = {
        createdAt: MoreThanOrEqual(dayjs().subtract(1, "d").toDate()),
        ...where,
      };
    } else if (timeframe === "weekly") {
      where = {
        createdAt: MoreThanOrEqual(dayjs().subtract(7, "d").toDate()),
        ...where,
      };
    }
    const investments = await Investment.find({
      where,
      order,
      skip,
      take,
    });
    return { items: investments, hasMore: investments.length === realTake };
  }
}
