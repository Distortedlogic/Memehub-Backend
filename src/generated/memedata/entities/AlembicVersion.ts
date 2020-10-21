import { Column, Entity, Index } from "typeorm";

@Index("alembic_version_pkc", ["versionNum"], { unique: true })
@Entity("alembic_version", { schema: "public" })
export class AlembicVersion {
  @Column("character varying", {
    primary: true,
    name: "version_num",
    length: 32
  })
  versionNum: string;
}
