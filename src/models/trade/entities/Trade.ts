import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "../../user/entities/User";
import { Template } from "./../../stonkMarket/entities/Template";

@ObjectType()
@Entity("trades")
export class Trade extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: string;

  @Field(() => Int)
  @Column("int")
  price: number;

  @Field(() => Int)
  @Column("int")
  position: number;

  @Field(() => Template)
  @ManyToOne(() => Template, (template) => template.marketData)
  template: Template;

  @Field()
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.trades, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
