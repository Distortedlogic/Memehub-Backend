import { Field, Int, ObjectType } from "type-graphql";
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
import { ITO } from "../ito/ITO.entity";
import { Meme } from "../meme/Meme.entity";

@ObjectType()
@Entity("templates")
export class Template extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Int)
  @Column("int")
  baseMemeId: number;

  @Field(() => Meme)
  @OneToOne(() => Meme, (meme) => meme.baseTemplate)
  baseMeme: Meme;

  @Field(() => [Meme])
  @OneToMany(() => Meme, (meme) => meme.template)
  memes: Meme[];

  @Field(() => Int)
  @Column("int", { nullable: true })
  itoId: number;

  @Field(() => ITO)
  @ManyToOne(() => ITO, (ito) => ito.templates, { onDelete: "CASCADE" })
  ito: ITO;

  @Field(() => Int)
  @Column("int", { nullable: true })
  season: number;

  @Field(() => Boolean)
  @Column("bool", { default: false })
  isStonk: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
