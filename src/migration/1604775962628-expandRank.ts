import {MigrationInterface, QueryRunner} from "typeorm";

export class expandRank1604775962628 implements MigrationInterface {
    name = 'expandRank1604775962628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rank" ADD "timeFrame" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rank" DROP CONSTRAINT "PK_7972aa60c43eaaf760a8f5fd1b8"`);
        await queryRunner.query(`ALTER TABLE "rank" ADD CONSTRAINT "PK_890c6fe74925bff7643977f1d10" PRIMARY KEY ("createdAt", "userId", "timeFrame")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rank" DROP CONSTRAINT "PK_890c6fe74925bff7643977f1d10"`);
        await queryRunner.query(`ALTER TABLE "rank" ADD CONSTRAINT "PK_7972aa60c43eaaf760a8f5fd1b8" PRIMARY KEY ("createdAt", "userId")`);
        await queryRunner.query(`ALTER TABLE "rank" DROP COLUMN "timeFrame"`);
    }

}
