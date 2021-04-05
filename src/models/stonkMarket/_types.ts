import { Field, Float, Int, ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Template } from "./entities/Template";

@ObjectType()
export class MarketData {
  @Field(() => Float)
  price: number;
  @Field(() => Int)
  marketcap: number;
  @Field(() => Int)
  numPosts: number;
  @Field()
  createdAt: Date;
}
@ObjectType()
export class PaginatedMarketData extends PaginatedResponse(MarketData) {}

@ObjectType()
export class Stonk extends Template {
  @Field(() => Float)
  price: number;
  @Field(() => Int)
  marketcap: number;
  @Field(() => Int)
  numPosts: number;
}

@ObjectType()
export class PaginatedStonks extends PaginatedResponse(Stonk) {}
