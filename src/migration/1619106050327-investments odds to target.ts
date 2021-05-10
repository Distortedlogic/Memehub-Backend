import {MigrationInterface, QueryRunner} from "typeorm";

export class investmentsOddsToTarget1619106050327 implements MigrationInterface {
    name = 'investmentsOddsToTarget1619106050327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" RENAME COLUMN "odds" TO "target"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" RENAME COLUMN "target" TO "odds"`);
    }

}
