import {MigrationInterface, QueryRunner} from "typeorm";

export class addStonkMarket1616189945627 implements MigrationInterface {
    name = 'addStonkMarket1616189945627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stonk_market" ("createdAt" TIMESTAMP NOT NULL, "source" character varying(100) NOT NULL, "subsource" character varying(100) NOT NULL, "market" text NOT NULL, CONSTRAINT "PK_1f68a9998ac4e855a6b2ea86719" PRIMARY KEY ("createdAt", "source", "subsource"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stonk_market"`);
    }

}
