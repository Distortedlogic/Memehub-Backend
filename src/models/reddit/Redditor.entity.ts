import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RedditMeme } from "./RedditMeme.entity";
import { RedditScore } from "./RedditScore.entity.";

@ObjectType()
@Entity("redditors")
export class Redditor {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("character varying", { name: "username", unique: true, length: 20 })
  username: string;

  @OneToMany(() => RedditMeme, (redditMeme) => redditMeme.redditor)
  redditMemes: RedditMeme[];

  @OneToMany(() => RedditScore, (redditScore) => redditScore.redditor)
  redditScores: RedditScore[];
}
