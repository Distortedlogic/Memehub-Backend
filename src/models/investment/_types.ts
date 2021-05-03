import { Field, Float, Int, ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Investment } from "./entities/Investment";

@ObjectType()
export class UserInvestmentStats {
  @Field(() => Int)
  bestTrade: number;

  @Field(() => Int)
  worstTrade: number;

  @Field(() => Int)
  profitLoss: number;

  @Field(() => Float)
  numTrades: number;

  @Field(() => Float)
  numGoodTrades: number;
}

@ObjectType()
export class UserRank {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field(() => Int)
  profitLoss: number;

  @Field()
  avatar: string;
}

@ObjectType()
export class InvestmentStats {
  @Field(() => Investment, { nullable: true })
  bestTrade?: Investment;

  @Field(() => Investment, { nullable: true })
  largestYolo?: Investment;

  @Field(() => [UserRank], { nullable: true })
  daily?: UserRank[];

  @Field(() => [UserRank], { nullable: true })
  weekly?: UserRank[];

  @Field(() => [UserRank], { nullable: true })
  season?: UserRank[];
}

@ObjectType()
export class PaginatedInvestments extends PaginatedResponse(Investment) {}
