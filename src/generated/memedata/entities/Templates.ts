import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("templates_pkey", ["id"], { unique: true })
@Index("templates_name_key", ["name"], { unique: true })
@Entity("templates", { schema: "public" })
export class Templates {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 100 })
  name: string;

  @Column("character varying", { name: "page", length: 100 })
  page: string;
}
