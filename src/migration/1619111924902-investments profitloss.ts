import {MigrationInterface, QueryRunner} from "typeorm";

export class investmentsProfitloss1619111924902 implements MigrationInterface {
    name = 'investmentsProfitloss1619111924902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ADD "profitLoss" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "profitLoss"`);
    }

}
