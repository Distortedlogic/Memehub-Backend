import { Field, Float, Int, ObjectType } from "type-graphql";
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
@Entity("investments")
export class Investment extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column()
  redditId: string;

  @Field(() => Int)
  @Column("int")
  betSize: number;

  @Field(() => Float)
  @Column("float")
  target: number;

  @Field(() => Float, { nullable: true })
  @Column("float", { nullable: true })
  percentile: number;

  @Field()
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.memes, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Int)
  @Column("int", { nullable: true })
  season: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int)
  @Column("int", { nullable: true })
  profitLoss: number;
}
