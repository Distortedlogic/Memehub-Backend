import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entities/User";

@ObjectType()
@Entity("trades")
export class Trade extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Float)
  @Column("float")
  entry: number;

  @Field(() => Float)
  @Column("float")
  exit: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.trades, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
