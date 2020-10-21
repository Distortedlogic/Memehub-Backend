import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RedditMemes } from "./RedditMemes";
import { RedditScores } from "./RedditScores";

@ObjectType()
@Index("redditors_pkey", ["id"], { unique: true })
@Index("redditors_username_key", ["username"], { unique: true })
@Entity("redditors", { schema: "public" })
export class Redditors {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Field(() => String)
  @Column("character varying", { name: "username", unique: true, length: 20 })
  username: string;

  @OneToMany(() => RedditMemes, (redditMemes) => redditMemes.redditor)
  redditMemes: RedditMemes[];

  @OneToMany(() => RedditScores, (redditScores) => redditScores.redditor)
  redditScores: RedditScores[];
}
