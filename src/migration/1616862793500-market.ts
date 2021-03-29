import {MigrationInterface, QueryRunner} from "typeorm";

export class market1616862793500 implements MigrationInterface {
    name = 'market1616862793500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "market" ("name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "source" character varying NOT NULL, "subsource" character varying NOT NULL, CONSTRAINT "PK_d9fabb3062c2d1e0ba5672e37a8" PRIMARY KEY ("name", "createdAt", "source", "subsource"))`);
        await queryRunner.query(`CREATE TABLE "templates" ("id" uuid NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_b8d8ba4734dcb43063a0ea0f81d" UNIQUE ("url"), CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "templates"`);
        await queryRunner.query(`DROP TABLE "market"`);
    }

}
