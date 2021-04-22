import { Field, Float, ObjectType } from "type-graphql";
@ObjectType()
export class GasPrices {
  @Field(() => Float)
  fast: number;
  @Field(() => Float)
  fastest: number;
  @Field(() => Float)
  safeLow: number;
  @Field(() => Float)
  average: number;
  @Field(() => Float)
  block_time: number;
  @Field(() => Float)
  blockNum: number;
  @Field(() => Float)
  speed: number;
  @Field(() => Float)
  safeLowWait: number;
  @Field(() => Float)
  avgWait: number;
  @Field(() => Float)
  fastWait: number;
  @Field(() => Float)
  fastestWait: number;
}
