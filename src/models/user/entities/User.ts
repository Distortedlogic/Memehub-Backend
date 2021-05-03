import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { BUCKET_BASE_URL } from "../../../utils/constants";
import { Comment } from "../../comment/entities/Comment";
import { CommentVote } from "../../comment/entities/CommentVote";
import { Meme } from "../../meme/entities/Meme";
import { MemeVote } from "../../meme/entities/MemeVote";
import { UserMemeEmoji } from "./../../emojis/entities/UserMemeEmoji";
import { Investment } from "./../../investment/entities/Investment";
import { Trade } from "./../../trade/entities/Trade";

const starterPic = BUCKET_BASE_URL + "memehub/misc/defaultAvatar.png";

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

  @Column({ nullable: true })
  password: string;

  @Field(() => Int)
  @Column({ default: 500 })
  gbp: number;

  @Field(() => [Trade])
  @OneToMany(() => Trade, (trade) => trade.user)
  trades: Trade[];

  @Field(() => [Investment])
  @OneToMany(() => Investment, (investment) => investment.user)
  investments: Investment[];

  @Field(() => [Meme])
  @OneToMany(() => Meme, (meme) => meme.user)
  memes: Meme[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [UserMemeEmoji])
  @OneToMany(() => UserMemeEmoji, (userMemeEmojis) => userMemeEmojis.user)
  userMemeEmojis: UserMemeEmoji[];

  @Field(() => [MemeVote])
  @OneToMany(() => MemeVote, (memeVote) => memeVote.user)
  memeVotes: MemeVote[];

  @Field(() => [CommentVote])
  @OneToMany(() => CommentVote, (commentVote) => commentVote.user)
  commentVotes: CommentVote[];

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  lastHivePost: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  lastMemehubPost: Date;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
