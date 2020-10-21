import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("train_data_pkey", ["id"], { unique: true })
@Entity("train_data", { schema: "public" })
export class TrainData {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("float8", { name: "features", array: true })
  features: number[];
}
