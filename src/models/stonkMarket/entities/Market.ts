import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Template } from "./Template";

@ObjectType()
@Entity("market")
export class Market extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

  @ManyToOne(() => Template, (template) => template.marketData)
  template: Template;

  @Field(() => Date)
  @PrimaryColumn()
  createdAt: Date;

  @Field(() => Int)
  @Column("int")
  numPosts: number;

  @Field(() => Int)
  @Column("int")
  numUpvotes: number;
}
