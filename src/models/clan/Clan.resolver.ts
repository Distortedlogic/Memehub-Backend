import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Auth } from "../../middleware/auth";
import { ServerContext } from "../../ServerContext";
import { User } from "../user/User.entity";
import { Clan } from "./Clan.entity";
import { PaginatedClans } from "./_types";

@Resolver(Clan)
export class ClanResolver {
  @FieldResolver(() => User)
  async leader(@Root() clan: Clan, @Ctx() { userByIdLoader }: ServerContext) {
    return userByIdLoader.load(clan.creatorId);
  }

  @FieldResolver(() => [User])
  async users(
    @Root() clan: Clan,
    @Ctx() { usersByClanIdLoader }: ServerContext
  ) {
    return usersByClanIdLoader.load(clan.id);
  }

  @Query(() => PaginatedClans)
  async clans(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number
  ): Promise<PaginatedClans> {
    const realTake = Math.min(50, take);
    const clans = await Clan.find({
      take,
      skip,
    });
    return { items: clans, hasMore: clans.length === realTake ? true : false };
  }

  @Query(() => Clan)
  @UseMiddleware(Auth)
  async clan(
    @Ctx()
    { req: { session } }: ServerContext
  ): Promise<Clan | undefined> {
    return (await User.findOne(session.userId, { relations: ["clan"] }))?.clan;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async leaveClan(
    @Ctx()
    {
      req: {
        session: { userId },
      },
    }: ServerContext
  ): Promise<boolean> {
    const user = await User.findOne({ id: userId });
    if (!user || !user.clanId) return false;
    await getConnection()
      .getRepository(Clan)
      .increment({ id: user.clanId }, "size", -1);
    user.clanId = null;
    user.save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async createClan(
    @Ctx()
    {
      req: {
        session: { userId },
      },
    }: ServerContext,
    @Arg("name") name: string
  ): Promise<boolean> {
    await Clan.create({ name, creatorId: userId }).save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async joinClan(
    @Ctx()
    {
      req: {
        session: { userId },
      },
    }: ServerContext,
    @Arg("clanId", () => Int) clanId: number
  ): Promise<boolean> {
    const user = await User.findOne(userId);
    if (!user || user.clan) return false;
    user.clanId = clanId;
    await getConnection()
      .getRepository(Clan)
      .increment({ id: clanId }, "size", 1);
    await user.save();
    return true;
  }
}
