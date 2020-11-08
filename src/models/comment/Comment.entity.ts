import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Meme } from "../meme/Meme.entity";
import { User } from "../user/User.entity";
import { CommentVote } from "./CommentVote.entity";

@ObjectType()
@Entity("comments")
export class Comment extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  text: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isHive: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  permlink: string;

  @Field()
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field()
  @Column({ nullable: true })
  memeId: string;

  @Field(() => Meme)
  @ManyToOne(() => Meme, (meme) => meme.comments, {
    cascade: ["insert", "update", "recover"],
    onDelete: "CASCADE",
  })
  meme: Meme;

  @Field(() => [CommentVote])
  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  commentVotes: CommentVote[];

  @Field(() => Int)
  @Column({ default: 0 })
  ups: number;

  @Field(() => Int)
  @Column({ default: 0 })
  downs: number;

  @Field(() => Float)
  @Column("float", { default: 1 })
  ratio: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
