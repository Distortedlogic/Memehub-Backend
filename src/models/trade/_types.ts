import { Field, Int, ObjectType } from "type-graphql";
import { PaginatedResponse } from "../../utils/types";
import { Trade } from "./entities/Trade";

@ObjectType()
export class PaginatedTrades extends PaginatedResponse(Trade) {}

@ObjectType()
export class Position {
  @Field()
  name: string;
  @Field(() => Int)
  price: number;
  @Field(() => Int)
  position: number;
}
@ObjectType()
export class PaginatedPositions extends PaginatedResponse(Position) {}
