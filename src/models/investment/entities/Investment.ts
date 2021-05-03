import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "../../user/entities/User";

@ObjectType()
@Entity("investments")
export class Investment extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => Int)
  @Column("int")
  season: number;

  @Field()
  @Column()
  redditId: string;

  @Field()
  @Column()
  type: string;

  @Field(() => Int)
  @Column("int")
  betSize: number;

  @Field(() => Int)
  @Column("int")
  upvotes: number;

  @Field(() => Float, { nullable: true })
  @Column("float", { nullable: true })
  target: number;

  @Field(() => Float)
  @Column("float")
  percentile: number;

  @Field(() => Int)
  @Column("int")
  profitLoss: number;

  @Field(() => Boolean)
  @Column("boolean")
  isYolo: boolean;

  @Field()
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.investments, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
