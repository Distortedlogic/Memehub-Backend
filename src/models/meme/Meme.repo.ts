import moment from "moment";
import { Service } from "typedi";
import {
  Any,
  EntityRepository,
  Equal,
  MoreThanOrEqual,
  Not,
  Repository,
} from "typeorm";
import { ordermap } from "./../../utils/functions/orderMap";
import { Meme } from "./Meme.entity";
import { PaginatedMemes } from "./_types";

@Service()
@EntityRepository(Meme)
export class MemeRepo extends Repository<Meme> {
  async userMemes(
    userId: string,
    take: number,
    skip: number,
    orderType: string
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const order = ordermap(orderType);
    if (!order) return { hasMore: false, items: [] };
    const memes = await Meme.find({
      where: { userId },
      order,
      skip,
      take,
    });
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }

  async communityMemes(
    community: string,
    take: number,
    skip?: number,
    days?: number
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const daysDate = moment.utc().subtract(days, "days").toDate();
    const where = days
      ? { createdAt: MoreThanOrEqual(daysDate), community }
      : { community };
    const memes = await Meme.find({
      where,
      order: {
        ratio: "DESC",
        ups: "DESC",
        numComments: "DESC",
        createdAt: "DESC",
      },
      take: realTake,
      skip,
    });
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }

  async topUpvoteMemes(
    take: number,
    skip?: number,
    days?: number
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const daysDate = moment.utc().subtract(days, "days").toDate();
    const where = days
      ? { createdAt: MoreThanOrEqual(daysDate), clanId: null }
      : { clanId: null };
    const memes = await Meme.find({
      where,
      order: {
        ups: "DESC",
        ratio: "DESC",
        numComments: "DESC",
        createdAt: "DESC",
      },
      take: realTake,
      skip,
    });
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }
  async topRatedMemes(
    take: number,
    skip?: number,
    days?: number
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const daysDate = moment.utc().subtract(days, "days").toDate();
    const where = days
      ? {
          createdAt: MoreThanOrEqual(daysDate),
          community: Not(Equal(Any(["dark", "political"]))),
        }
      : { community: Not(Equal(Any(["dark", "political"]))) };
    const memes = await Meme.find({
      where,
      order: {
        ratio: "DESC",
        ups: "DESC",
        numComments: "DESC",
        createdAt: "DESC",
      },
      take: realTake,
      skip,
    });
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }
}
