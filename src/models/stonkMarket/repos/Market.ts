import { Dayjs } from "dayjs";
import { Service } from "typedi";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { Market } from "./../entities/Market";

@Service()
@EntityRepository(Market)
export class MarketRepo extends Repository<Market> {
  async getMarketData(
    name: string,
    createdAt: Dayjs
  ): Promise<{ marketcap: number; price: number }> {
    const { marketcap, price } = await getConnection()
      .getRepository(Market)
      .createQueryBuilder("market")
      .select("SUM(market.numUpvotes)", "marketcap")
      .addSelect(
        "CASE WHEN SUM(market.numPosts) != 0 THEN SUM(market.numUpvotes)/SUM(market.numPosts) ELSE 0 END",
        "price"
      )
      .orderBy("price", "DESC")
      .groupBy("market.name")
      .where("market.name = :name", { name: name })
      .andWhere("market.createdAt >= :start", {
        start: createdAt.subtract(7, "d").toDate(),
      })
      .andWhere("market.createdAt <= :end", {
        end: createdAt.toDate(),
      })
      .getRawOne();
    return { marketcap, price };
  }
}
