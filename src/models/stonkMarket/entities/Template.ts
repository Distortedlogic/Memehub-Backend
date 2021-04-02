import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Market } from "./Market";

@ObjectType()
@Entity("templates")
export class Template extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

  @Field()
  @Column({ unique: true })
  url: string;

  @OneToMany(() => Market, (market) => market.template)
  marketData: Market[];
}
