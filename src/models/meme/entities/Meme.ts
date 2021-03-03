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
import { Comment } from "../../comment/entities/Comment";
import { User } from "../../user/entities/User";
import { MemeVote } from "./MemeVote";

@ObjectType()
@Entity("memes")
export class Meme extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isHive: boolean;

  @Field()
  @Column({ nullable: true })
  title: string;

  @Field()
  @Column({ nullable: true })
  ocrText: string;

  @Field()
  @Column() // { unique: true } unique constraint clashes with fake db data generation
  url: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column({ nullable: true })
  stonk: string;

  @Field()
  @Column({ nullable: true })
  version: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.memes, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => Int)
  @Column("int", { nullable: true })
  season: number;

  @Field()
  @Column()
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
