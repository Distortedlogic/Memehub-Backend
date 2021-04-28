import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Meme } from "./../../meme/entities/Meme";
import { User } from "./../../user/entities/User";
import { Emoji } from "./Emoji";

@ObjectType()
@Entity("user_meme_emojis")
export class UserMemeEmoji extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.userMemeEmojis, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Field()
  @Column()
  memeId: string;

  @Field(() => Meme)
  @ManyToOne(() => Meme, (meme) => meme.userMemeEmojis, {
    cascade: true,
    onDelete: "CASCADE",
  })
  meme: Meme;

  @Field()
  @Column()
  emojiId: string;

  @Field(() => Emoji)
  @ManyToOne(() => Emoji, (emoji) => emoji.userMemeEmojis)
  emoji: Emoji;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
