import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Redditor } from "./Redditor.entity";

@ObjectType()
@Entity("reddit_memes")
export class RedditMeme extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("character varying", { name: "username", length: 20 })
  username: string;

  @Column("character varying", { name: "reddit_id", length: 20 })
  redditId: string;

  @Field()
  @Column("character varying", { name: "subreddit", length: 50 })
  subreddit: string;

  @Field()
  @Column("character varying", { name: "title", length: 500 })
  title: string;

  @Field()
  @Column("character varying", { name: "url", length: 1000 })
  url: string;

  @Column("character varying", {
    name: "meme_text",
    nullable: true,
    length: 1000000,
  })
  memeText: string | null;

  @Column("character varying", {
    name: "template",
    nullable: true,
    length: 100,
  })
  template: string | null;

  @Field(() => Int)
  @Column("integer", { name: "timestamp" })
  timestamp: number;

  @Field(() => Date)
  @Column("timestamp without time zone", { name: "created_at" })
  createdAt: Date;

  @Field(() => Float)
  @Column("double precision", { name: "upvote_ratio" })
  upvoteRatio: number;

  @Field(() => Int)
  @Column("integer", { name: "upvotes" })
  upvotes: number;

  @Field(() => Int)
  @Column("integer", { name: "downvotes" })
  downvotes: number;

  @Field(() => Int)
  @Column("integer", { name: "num_comments" })
  numComments: number;

  @Column("float8", { name: "features", nullable: true, array: true })
  features: number[] | null;

  @Field(() => Int)
  @Column("int", { name: "redditor_id", nullable: true })
  redditorId: number;

  @ManyToOne(() => Redditor, (redditor) => redditor.redditMemes)
  redditor: Redditor;
}
