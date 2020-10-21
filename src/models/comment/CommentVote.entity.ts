import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "../user/User.entity";
import { Comment } from "./Comment.entity";

export interface commentVoteKey {
  userId: number;
  commentId: number;
}

@ObjectType()
@Entity()
export class CommentVote extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.commentVotes, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Int)
  @PrimaryColumn()
  commentId!: number;

  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.commentVotes, {
    onDelete: "CASCADE",
  })
  comment: Comment;

  @Field(() => Boolean)
  @Column()
  upvote: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
