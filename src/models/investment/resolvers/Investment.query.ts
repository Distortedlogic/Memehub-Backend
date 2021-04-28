import { Arg, Ctx, Int, Query, Resolver, UseMiddleware } from "type-graphql";
import { Auth } from "./../../../middleware/auth";
import { ServerContext } from "./../../../ServerContext";
import { Investment } from "./../entities/Investment";
import { PaginatedInvestments } from "./../_types";

@Resolver(Investment)
export class InvestmentQueryResolver {
  @Query(() => PaginatedInvestments, { nullable: true })
  @UseMiddleware(Auth)
  async myInvestments(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) orderStr: string
  ): Promise<PaginatedInvestments> {
    const realTake = Math.min(50, take);
    if (orderStr) {
    }
    const order = { createdAt: "DESC" as const };
    const investments = await Investment.find({
      where: { userId: session.userId },
      order,
      skip,
      take,
    });
    return { items: investments, hasMore: investments.length === realTake };
  }
}
