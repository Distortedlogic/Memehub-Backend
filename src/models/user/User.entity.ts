import { Field, Int, ObjectType } from "type-graphql";
import {
  AfterUpdate,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Clan } from "../clan/Clan.entity";
import { Comment } from "../comment/Comment.entity";
import { CommentVote } from "../comment/CommentVote.entity";
import { Follow } from "../follow/Follow.entity";
import { Meme } from "../meme/Meme.entity";
import { MemeVote } from "../meme/MemeVote.entity";
import { Rank } from "../rank/Rank.entity";
import { Wager } from "../wager/Wager.entity";

const starterPic = "/defaultAvatar.png";

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
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isHive: boolean;

  @Field(() => String)
  @Column({ unique: true, nullable: true })
  email: string;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
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

  @Field(() => Int)
  @Column("int", { nullable: true })
  clanCreatedId: number;

  @Field(() => Clan)
  @OneToOne(() => Clan, (clan) => clan.creator)
  clanCreated: Clan;

  @Field(() => Int)
  @Column("int", { nullable: true })
  rankId: number;

  @Field(() => Rank)
  @OneToOne(() => Rank, (rank) => rank.user)
  rank: Rank;

  @Field(() => Int)
  @Column("int", { nullable: true })
  clanId: number | null;

  @Field(() => Clan, { nullable: true })
  @ManyToOne(() => Clan, (clan) => clan.users, {
    cascade: true,
    onDelete: "CASCADE",
  })
  clan: Clan;

  @Field(() => [Wager])
  @OneToMany(() => Wager, (wager) => wager.user)
  wagers: Wager[];

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
