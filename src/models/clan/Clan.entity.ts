import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Meme } from "../meme/Meme.entity";
import { User } from "../user/User.entity";

@ObjectType()
@Entity("clans")
export class Clan extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.clanCreated)
  creator: User;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.clan)
  users: User[];

  @Field(() => Int)
  @Column({ default: 1 })
  size: number;

  @Field(() => [Meme])
  @OneToMany(() => Meme, (meme) => meme.clan)
  memes: Meme[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
