import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from "typeorm";

@ObjectType()
@Entity("emojis")
export class Emoji extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

  @Field()
  @Column()
  url: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
