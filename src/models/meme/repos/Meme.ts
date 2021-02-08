import dayjs from "dayjs";
import moment from "moment";
import { Service } from "typedi";
import {
  EntityRepository,
  getConnection,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { ordermap } from "../../../utils/functions/orderMap";
import { Meme } from "../entities/Meme";
import { PaginatedMemes } from "../_types";

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
    const where = days
      ? {
          createdAt: MoreThanOrEqual(dayjs().subtract(days, "d").toDate()),
          community,
        }
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
    const where = days ? { createdAt: MoreThanOrEqual(daysDate) } : {};
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
    skip: number,
    days: number
  ): Promise<PaginatedMemes> {
    const realTake = Math.min(50, take);
    const daysDate = moment.utc().subtract(days, "days").toDate();
    const memesQ = getConnection()
      .createQueryBuilder()
      .select("meme")
      .from(Meme, "meme")
      .where("meme.community IN (:...communities)", {
        communities: ["none", "wholesome", "hive", "original"],
      })
      .orderBy("meme.ratio", "DESC")
      .addOrderBy("meme.ups", "DESC")
      .addOrderBy("meme.numComments", "DESC")
      .addOrderBy("meme.createdAt", "DESC")
      .take(realTake)
      .skip(skip);
    if (days !== -1) {
      memesQ.andWhere("meme.createdAt >= :daysDate", { daysDate });
    }
    const memes = await memesQ.getMany();
    return {
      items: memes,
      hasMore: memes.length === realTake ? true : false,
    };
  }
}
