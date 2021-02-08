import { Field, Int, ObjectType } from "type-graphql";
import {
  AfterUpdate,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { BUCKET_BASE_URL } from "../../../utils/constants";
import { Comment } from "../../comment/entities/Comment";
import { CommentVote } from "../../comment/entities/CommentVote";
import { Follow } from "../../follow/entities/Follow";
import { Meme } from "../../meme/entities/Meme";
import { MemeVote } from "../../meme/entities/MemeVote";
import { Rank } from "../../rank/entities/Rank";

const starterPic = `${BUCKET_BASE_URL}/misc/defaultAvatar.png`;

const actionToPoints: Record<string, number> = {
  memeVoteGiven: 1,
  memeUpvoteRecieved: 10,
  memeDownvoteRecieved: -12,
  memeCommentRecieved: 2,
  commentVoteGiven: 1,
  commentUpvoteRecieved: 5,
  commentDownvoteRecieved: -6,
  followRecieved: 7,
};

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isHive: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  verified: boolean;

  @Field()
  @Column({ unique: true, nullable: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ default: starterPic })
  avatar: string;

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @Field(() => [Meme])
  @OneToMany(() => Meme, (meme) => meme.user)
  memes: Meme[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [MemeVote])
  @OneToMany(() => MemeVote, (memeVote) => memeVote.user)
  memeVotes: MemeVote[];

  @Field(() => [CommentVote])
  @OneToMany(() => CommentVote, (commentVote) => commentVote.user)
  commentVotes: CommentVote[];

  @Field(() => Rank)
  @OneToOne(() => Rank, (rank) => rank.user)
  rank: Rank;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  password: string;

  @Field(() => Int)
  @Column({ default: 0 })
  numFollowing: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numFollowers: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numMemeVotesGiven: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numMemeUpvotesRecieved: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numMemeDownvotesRecieved: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numMemeCommentsRecieved: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numCommentVotesGiven: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numCommentUpvotesRecieved: number;

  @Field(() => Int)
  @Column({ default: 0 })
  numCommentDownvotesRecieved: number;

  @Field(() => Int)
  @Column({ default: 0 })
  totalPoints: number;

  @AfterUpdate()
  updateTotalPoints() {
    this.totalPoints =
      this.numMemeVotesGiven * actionToPoints["memeVoteGiven"] +
      this.numMemeUpvotesRecieved * actionToPoints["memeUpvoteRecieved"] +
      this.numMemeDownvotesRecieved * actionToPoints["memeDownvoteRecieved"] +
      this.numMemeCommentsRecieved * actionToPoints["memeCommentRecieved"] +
      this.numCommentVotesGiven * actionToPoints["commentVoteGiven"] +
      this.numCommentUpvotesRecieved * actionToPoints["commentUpvoteRecieved"] +
      this.numCommentDownvotesRecieved *
        actionToPoints["commentDownvoteRecieved"];
    this.save();
  }
}
