import { Field, Float, Int, ObjectType } from "type-graphql";
import {
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
import { Contest } from "../contest/Contest.entity";
import { Template } from "../template/Template.entity";
import { User } from "../user/User.entity";
import { MemeVote } from "./MemeVote.entity";

@ObjectType()
@Entity("memes")
export class Meme extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  title: string;

  @Field()
  @Column({ unique: true })
  url: string;

  @Field(() => Int)
  @Column("int", { nullable: true })
  templateId: number;

  @Field(() => Template)
  @ManyToOne(() => Template, (template) => template.memes, {
    onDelete: "CASCADE",
    cascade: true,
  })
  template: Template;

  @Field(() => Int)
  @Column("int", { nullable: true })
  baseTemplateId: number;

  @Field(() => Template)
  @OneToOne(() => Template, (template) => template.baseMeme, {
    onDelete: "CASCADE",
  })
  baseTemplate: Template;

  @Field(() => Int)
  @Column("int", { nullable: true })
  contestId: number;

  @Field(() => Contest)
  @ManyToOne(() => Contest, (contest) => contest.memes)
  contest: Contest;

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

  @Field(() => Int)
  @Column("int", { nullable: true })
  clanId: number;

  @Field(() => Clan)
  @ManyToOne(() => Clan, (clan) => clan.memes)
  clan: Clan;

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
