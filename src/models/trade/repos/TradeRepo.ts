import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Trade } from "./../entities/Trade";

@Service()
@EntityRepository(Trade)
export class TradeRepo extends Repository<Trade> {}
