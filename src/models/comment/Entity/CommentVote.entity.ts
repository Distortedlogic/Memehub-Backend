import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "../../user/User.entity";
import { Comment } from "./Comment.entity";

export interface commentVoteKey {
  userId: string;
  commentId: string;
}

@ObjectType()
@Entity("comment_votes")
export class CommentVote extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  userId!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.commentVotes, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Int)
  @PrimaryColumn()
  commentId!: string;

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
