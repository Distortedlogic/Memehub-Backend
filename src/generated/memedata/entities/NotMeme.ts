import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("not_meme_pkey", ["id"], { unique: true })
@Entity("not_meme", { schema: "public" })
export class NotMeme {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("float8", { name: "features", array: true })
  features: number[];
}
