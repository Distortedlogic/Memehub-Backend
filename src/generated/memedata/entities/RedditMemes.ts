import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Redditors } from "./Redditors";

@ObjectType()
@Index("reddit_memes_pkey", ["id"], { unique: true })
@Entity("reddit_memes", { schema: "public" })
export class RedditMemes {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Field(() => String)
  @Column("character varying", { name: "username", length: 20 })
  username: string;

  @Column("character varying", { name: "reddit_id", length: 20 })
  redditId: string;

  @Field(() => String)
  @Column("character varying", { name: "subreddit", length: 50 })
  subreddit: string;

  @Field(() => String)
  @Column("character varying", { name: "title", length: 500 })
  title: string;

  @Field(() => String)
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

  @Column("timestamp without time zone", { name: "datetime" })
  datetime: Date;

  @Field(() => Float)
  @Column("double precision", { name: "upvote_ratio", precision: 53 })
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

  @ManyToOne(() => Redditors, (redditors) => redditors.redditMemes)
  @JoinColumn([{ name: "redditor_id", referencedColumnName: "id" }])
  redditor: Redditors;
}
