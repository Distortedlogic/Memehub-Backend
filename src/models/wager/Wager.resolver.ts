import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { ServerContext } from "../../ServerContext";
import { Wager } from "./Wager.entity";

@Resolver()
export class WagerResolver {
  @Mutation(() => Wager)
  async open(
    @Ctx()
    {
      req: {
        session: { userId },
      },
    }: ServerContext,
    @Arg("market", () => String) market: string,
    @Arg("position", () => Int) position: number,
    @Arg("entry", () => Int) entry: number
  ): Promise<Wager> {
    return await Wager.create({
      userId,
      market,
      position,
      entry,
    }).save();
  }

  @Mutation(() => Wager)
  async close(
    @Ctx()
    {
      req: {
        session: { userId },
      },
    }: ServerContext,
    @Arg("id", () => Int) id: number,
    @Arg("exit", () => Int) exit: number
  ): Promise<Wager> {
    return (await Wager.update({ id, userId }, { exit })).raw;
  }
}
