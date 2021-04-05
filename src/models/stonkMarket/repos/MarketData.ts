import { Dayjs } from "dayjs";
import { Service } from "typedi";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { MARKET_AGG_PERIOD } from "../../../utils/constants";
import { Market } from "../entities/Market";
import { MarketData } from "../_types";

@Service()
@EntityRepository(Market)
export class MarketRepo extends Repository<Market> {
  async getMarketData(name: string, createdAt: Dayjs): Promise<MarketData> {
    const { marketcap, price, numPosts } = await getConnection()
      .getRepository(Market)
      .createQueryBuilder("market")
      .select("SUM(market.numUpvotes)", "marketcap")
      .addSelect("SUM(market.numPosts)", "numPosts")
      .addSelect(
        "CASE WHEN SUM(market.numPosts) != 0 THEN SUM(market.numUpvotes)/SUM(market.numPosts) ELSE 0 END",
        "price"
      )
      .where("market.name = :name", { name })
      .andWhere("market.createdAt >= :start", {
        start: createdAt.subtract(MARKET_AGG_PERIOD, "d").toDate(),
      })
      .andWhere("market.createdAt <= :end", {
        end: createdAt.toDate(),
      })
      .getRawOne();
    return { marketcap, price, numPosts, createdAt: createdAt.toDate() };
  }
}
