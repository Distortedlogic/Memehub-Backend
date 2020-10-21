import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Redditors } from "./Redditors";

@Index("reddit_scores_pkey", ["id"], { unique: true })
@Entity("reddit_scores", { schema: "public" })
export class RedditScores {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "username", length: 20 })
  username: string;

  @Column("character varying", { name: "subreddit", length: 50 })
  subreddit: string;

  @Column("integer", { name: "time_delta" })
  timeDelta: number;

  @Column("integer", { name: "timestamp" })
  timestamp: number;

  @Column("timestamp without time zone", { name: "datetime" })
  datetime: Date;

  @Column("double precision", { name: "final_score", precision: 53 })
  finalScore: number;

  @Column("double precision", { name: "raw_score", precision: 53 })
  rawScore: number;

  @Column("integer", { name: "num_in_bottom" })
  numInBottom: number;

  @Column("integer", { name: "num_in_top" })
  numInTop: number;

  @Column("double precision", { name: "shitposter_index", precision: 53 })
  shitposterIndex: number;

  @Column("integer", { name: "highest_upvotes" })
  highestUpvotes: number;

  @Column("double precision", { name: "hu_score", precision: 53 })
  huScore: number;

  @Column("double precision", { name: "lowest_ratio", precision: 53 })
  lowestRatio: number;

  @ManyToOne(
    () => Redditors,
    redditors => redditors.redditScores
  )
  @JoinColumn([{ name: "redditor_id", referencedColumnName: "id" }])
  redditor: Redditors;
}
