import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "../user/User.entity";

export interface followKey {
  followerId: number;
  followingId: number;
}

@ObjectType()
@Entity("follows")
export class Follow extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  followerId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.following, { onDelete: "CASCADE" })
  follower: User;

  @Field(() => Int)
  @PrimaryColumn()
  followingId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.followers, { onDelete: "CASCADE" })
  following: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
