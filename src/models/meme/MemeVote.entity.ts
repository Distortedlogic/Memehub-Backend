import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./../user/User.entity";
import { Meme } from "./Meme.entity";

export interface memeVoteKey {
  userId: string;
  memeId: string;
}

@ObjectType()
@Entity()
export class MemeVote extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  userId: string;

  @Field(() => Int)
  @PrimaryColumn()
  memeId: string;

  @Field(() => Meme)
  @ManyToOne(() => Meme, (meme) => meme.memeVotes, {
    cascade: true,
    onDelete: "CASCADE",
  })
  meme: Meme;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.memeVotes, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Boolean)
  @Column()
  upvote: boolean;

  @Field(() => Date)
  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
