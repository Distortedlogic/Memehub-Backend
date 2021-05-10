import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix31619557161091 implements MigrationInterface {
    name = 'percentileFix31619557161091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "percentile" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "profitLoss" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "profitLoss" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "percentile" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
