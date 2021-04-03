import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Template } from "./Template";

@ObjectType()
@Entity("market")
export class Market extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  templateId: string;

  @ManyToOne(() => Template, (template) => template.marketData)
  template: Template;

  @Field(() => Date)
  @Column()
  createdAt: Date;

  @Field(() => Int)
  @Column("int")
  numPosts: number;

  @Field(() => Int)
  @Column("int")
  numUpvotes: number;
}
