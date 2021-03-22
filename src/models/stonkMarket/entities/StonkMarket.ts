import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
class Market {
  @Field(() => String)
  name: string;
  @Field(() => Int)
  numPosts: number;
  @Field(() => Int)
  totalUpvotes: number;
  @Field(() => Int)
  upvotesPerPost: number;
}

@ObjectType()
@Entity("stonk_market")
export class StonkMarket extends BaseEntity {
  @Field(() => Date)
  @PrimaryColumn()
  createdAt: Date;

  @Field(() => String)
  @PrimaryColumn("character varying", {
    name: "source",
    length: 100,
  })
  source: string;

  @Field(() => String)
  @PrimaryColumn("character varying", {
    name: "subsource",
    length: 100,
  })
  subsource: string | null;

  @Field(() => [Market])
  @Column({
    type: "jsonb",
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  market: Array<Market>;
}
