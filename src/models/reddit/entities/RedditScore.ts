import { Field, Float, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Redditor } from "./Redditor";

@ObjectType()
@Entity("reddit_scores")
export class RedditScore {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("character varying", { name: "username", length: 20 })
  username: string;

  @Field()
  @Column("character varying", { name: "subreddit", length: 50 })
  subreddit: string;

  @Field(() => Int)
  @Column("integer", { name: "time_delta" })
  timeDelta: number;

  @Field(() => Int)
  @Column("integer", { name: "timestamp" })
  timestamp: number;

  @Field(() => Date)
  @Column("timestamp without time zone", { name: "datetime" })
  datetime: Date;

  @Field(() => Float)
  @Column("double precision", { name: "final_score" })
  finalScore: number;

  @Field(() => Float)
  @Column("double precision", { name: "raw_score" })
  rawScore: number;

  @Field(() => Int)
  @Column("integer", { name: "num_in_bottom" })
  numInBottom: number;

  @Field(() => Int)
  @Column("integer", { name: "num_in_top" })
  numInTop: number;

  @Field(() => Float)
  @Column("double precision", { name: "shitposter_index" })
  shitposterIndex: number;

  @Field(() => Int)
  @Column("integer", { name: "highest_upvotes" })
  highestUpvotes: number;

  @Field(() => Float)
  @Column("double precision", { name: "hu_score" })
  huScore: number;

  @Field(() => Float)
  @Column("double precision", { name: "lowest_ratio" })
  lowestRatio: number;

  @Field(() => Int)
  @Column("int", { nullable: true, name: "redditor_id" })
  redditorId: number;

  @ManyToOne(() => Redditor, (redditor) => redditor.redditScores)
  redditor: Redditor;
}
