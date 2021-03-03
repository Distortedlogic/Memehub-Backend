import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../../user/entities/User";

@ObjectType()
@Entity("rank")
export class Rank extends BaseEntity {
  @Field(() => Date)
  @PrimaryColumn()
  createdAt: Date;

  @Field()
  @PrimaryColumn()
  userId: string;

  @Field()
  @PrimaryColumn()
  timeFrame: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.rank, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Int)
  @Column()
  rank: number;

  @Field(() => Int)
  @Column()
  totalPoints: number;
}
