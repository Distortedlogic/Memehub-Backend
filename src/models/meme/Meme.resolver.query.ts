import moment from "moment";
import { Arg, Ctx, Int, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { Any, Equal, getConnection, LessThan, Not } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Auth } from "../../middleware/auth";
import { ServerContext } from "../../ServerContext";
import { Follow } from "./../follow/Follow.entity";
import { Meme } from "./Meme.entity";
import { MemeRepo } from "./Meme.repo";
import { communityList, PaginatedMemes } from "./_types";

@Service()
@Resolver(Meme)
export class MemeQueryResolver {
  @InjectRepository(MemeRepo)
  private readonly memeRepo: MemeRepo;

  @Query(() => PaginatedMemes, { nullable: true })
  @UseMiddleware(Auth)
  async myMemes(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) order: string
  ): Promise<PaginatedMemes> {
    return await this.memeRepo.userMemes(session.userId, take, skip, order);
  }

  @Query(() => PaginatedMemes, { nullable: true })
  @UseMiddleware(Auth)
  async userMemes(
    @Arg("userId", () => Int) userId: number,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) order: string
  ): Promise<PaginatedMemes> {
    return await this.memeRepo.userMemes(userId, take, skip, order);
  }

  @Query(() => Meme, { nullable: true })
  async meme(
    @Arg("memeId", () => Int) memeId: number
  ): Promise<Meme | undefined> {
    return await Meme.findOne(memeId);
  }

  @Query(() => PaginatedMemes)
  async newMemes(
    @Arg("take", () => Int) take: number,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const where = cursor
      ? {
          createdAt: LessThan(new Date(cursor)),
          community: Not(Equal(Any(["dark", "political"]))),
        }
      : { community: Not(Equal(Any(["dark", "political"]))) };
    const memes = await Meme.find({
      where,
      order: { createdAt: "DESC", ups: "DESC", numComments: "DESC" },
      take: realTake,
    });
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }

  @Query(() => PaginatedMemes)
  async communityMemes(
    @Arg("community", () => String) community: string,
    @Arg("take", () => Int) take: number,
    @Arg("days", () => Int, { nullable: true }) days?: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
  ): Promise<PaginatedMemes> {
    if (
      (days && ![1, 7, 30].includes(days)) ||
      !communityList.includes(community)
    )
      return { hasMore: false, items: [] };
    return await this.memeRepo.communityMemes(community, take, skip, days);
  }

  @Query(() => PaginatedMemes)
  async topRatedMemes(
    @Arg("take", () => Int) take: number,
    @Arg("days", () => Int, { nullable: true }) days?: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
  ): Promise<PaginatedMemes> {
    if (days && ![1, 7, 30].includes(days))
      return { hasMore: false, items: [] };
    return await this.memeRepo.topRatedMemes(take, skip, days);
  }

  @Query(() => PaginatedMemes)
  async hotMemes(
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const memes = await getConnection()
      .getRepository(Meme)
      .createQueryBuilder("meme")
      .leftJoinAndSelect("meme.memeVotes", "vote", "vote.memeId=meme.id")
      .addSelect("COUNT(vote)", "count")
      .where("vote.createdAt > :t", {
        t: moment.utc().subtract(1, "days").toDate(),
      })
      .andWhere("vote.upvote = :truth", { truth: true })
      .andWhere("meme.community != ANY(:...comms)", {
        comms: ["dark", "political"],
      })
      .orderBy("count", "DESC")
      .groupBy("meme.id")
      .addGroupBy("vote.userId")
      .addGroupBy("vote.memeId")
      .take(realTake)
      .skip(skip)
      .getMany();
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }

  @Query(() => PaginatedMemes, { nullable: true })
  async followingMemes(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("take", () => Int) take: number,
    @Arg("skip", () => Int) skip: number,
    @Arg("order", () => String) order: string
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const orderMap: Record<string, string> = {
      new: "meme.createdAt",
      upvotes: "meme.ups",
      ratio: "meme.ratio",
    };
    if (!["new", "ratio", "upvotes"].includes(order))
      return { hasMore: false, items: [] };
    const memes = await getConnection()
      .getRepository(Meme)
      .createQueryBuilder("meme")
      .select("meme")
      .innerJoin(Follow, "follow", "follow.followingId = meme.userId")
      .where("follow.followerId = :userId", { userId: session.userId })
      .orderBy(orderMap[order], "DESC")
      .skip(skip)
      .take(realTake)
      .getMany();
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }
}
