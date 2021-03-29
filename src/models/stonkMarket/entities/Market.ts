import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity("market")
export class Market extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

  @Field(() => Date)
  @PrimaryColumn()
  createdAt: Date;

  @Field(() => String)
  @PrimaryColumn()
  source: string;

  @Field(() => String)
  @PrimaryColumn()
  subsource: string;

  @Field(() => Int)
  @Column("int")
  numPosts: number;

  @Field(() => Int)
  @Column("int")
  numUpvotes: number;
}
