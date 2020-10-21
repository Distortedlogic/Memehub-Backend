import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/User.entity";

@ObjectType()
@Entity("wagers")
export class Wager extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  market: string;

  @Field(() => Int)
  @Column("int")
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.wagers, { onDelete: "CASCADE" })
  user: User;

  @Field(() => Int)
  @Column("int")
  position: number;

  @Field(() => Float)
  @Column("float")
  entry: number;

  @Field(() => Date)
  @CreateDateColumn()
  closedAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Float)
  @Column("float")
  exit: number;
}
