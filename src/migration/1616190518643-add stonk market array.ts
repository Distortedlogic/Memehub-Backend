import {MigrationInterface, QueryRunner} from "typeorm";

export class addStonkMarketArray1616190518643 implements MigrationInterface {
    name = 'addStonkMarketArray1616190518643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stonk_market" DROP COLUMN "market"`);
        await queryRunner.query(`ALTER TABLE "stonk_market" ADD "market" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stonk_market" DROP COLUMN "market"`);
        await queryRunner.query(`ALTER TABLE "stonk_market" ADD "market" text NOT NULL`);
    }

}
