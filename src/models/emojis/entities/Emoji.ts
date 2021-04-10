import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { UserMemeEmoji } from "./UserMemeEmoji";

@ObjectType()
@Entity("emojis")
export class Emoji extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  url: string;

  @Field(() => [UserMemeEmoji])
  @OneToMany(() => UserMemeEmoji, (userMemeEmojis) => userMemeEmojis.emoji, {
    cascade: true,
    onDelete: "CASCADE",
  })
  userMemeEmojis: UserMemeEmoji[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
