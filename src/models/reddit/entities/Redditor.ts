import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RedditMeme } from "./RedditMeme";
import { RedditScore } from "./RedditScore";

@ObjectType()
@Entity("redditors")
export class Redditor extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("character varying", { name: "username", unique: true, length: 20 })
  username: string;

  @OneToMany(() => RedditMeme, (redditMeme) => redditMeme.redditor)
  redditMemes: RedditMeme[];

  @OneToMany(() => RedditScore, (redditScore) => redditScore.redditor)
  redditScores: RedditScore[];
}
