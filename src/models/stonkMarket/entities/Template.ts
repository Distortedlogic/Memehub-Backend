import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Trade } from "./../../trade/entities/Trade";
import { Market } from "./Market";

@ObjectType()
@Entity("templates")
export class Template extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  url: string;

  @Field(() => [Market])
  @OneToMany(() => Market, (market) => market.template)
  marketData: Market[];

  @Field(() => [Trade])
  @OneToMany(() => Trade, (trades) => trades.template)
  trades: Trade[];
}
