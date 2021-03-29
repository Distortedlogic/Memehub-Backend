import { Field, Float, Int, ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Template } from "./entities/Template";

@ObjectType()
export class Stonk extends Template {
  @Field(() => Float)
  price: number;
  @Field(() => Int)
  marketcap: number;
}

@ObjectType()
export class PaginatedStonks extends PaginatedResponse(Stonk) {}
