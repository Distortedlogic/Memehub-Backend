import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "../comment/Comment.entity";
import { User } from "../user/User.entity";
import { MemeVote } from "./MemeVote.entity";

@ObjectType()
@Entity("memes")
export class Meme extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isHive: boolean;

  @Field()
  @Column({ nullable: true })
  title: string;

  @Field()
  @Column({ unique: true })
  url: string;

  @Field(() => Int)
  @Column("int")
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.memes, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Int)
  @Column("int", { nullable: true })
  season: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  community: string;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.meme, {
    cascade: true,
    onDelete: "CASCADE",
  })
  comments: Comment[];

  @Field(() => Int)
  @Column({ default: 0 })
  numComments: number;

  @Field(() => [MemeVote])
  @OneToMany(() => MemeVote, (memevote) => memevote.meme)
  memeVotes: MemeVote[];

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
