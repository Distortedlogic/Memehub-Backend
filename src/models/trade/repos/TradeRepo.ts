import dayjs from "dayjs";
import { Service } from "typedi";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { Market } from "./../../stonkMarket/entities/Market";
import { Trade } from "./../entities/Trade";

@Service()
@EntityRepository(Trade)
export class TradeRepo extends Repository<Trade> {
  async currentPrice(name: string): Promise<number | undefined> {
    const createdAt = dayjs().set("h", 0).set("m", 0).set("s", 0).set("ms", 0);
    const marketData = await getConnection()
      .getRepository(Market)
      .createQueryBuilder("market")
      .select(
        "CASE WHEN SUM(market.numPosts) != 0 THEN SUM(market.numUpvotes)/SUM(market.numPosts) ELSE 0 END",
        "price"
      )
      .where("market.name = :name", { name })
      .andWhere("market.createdAt >= :start", {
        start: createdAt.subtract(30, "d").toDate(),
      })
      .getRawOne();
    if (marketData) {
      return marketData.price;
    } else {
      return 0;
    }
  }
}
