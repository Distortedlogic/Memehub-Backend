import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("reddit_new")
export class RedditNew extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("character varying", { name: "username", length: 20 })
  username: string;

  @Column("character varying", { name: "reddit_id", length: 20 })
  redditId: string;

  @Field()
  @Column("character varying", { name: "title", length: 500 })
  title: string;

  @Field()
  @Column("character varying", { name: "url", length: 1000, unique: true })
  url: string;

  @Field(() => Date)
  @Column("timestamp without time zone", { name: "created_at" })
  createdAt: Date;
}
