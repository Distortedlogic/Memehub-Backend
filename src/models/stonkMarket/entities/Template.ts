import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity("templates")
export class Template extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

  @Field()
  @Column({ unique: true })
  url: string;
}
