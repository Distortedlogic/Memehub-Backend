import {MigrationInterface, QueryRunner} from "typeorm";

export class tradeFix41617477851630 implements MigrationInterface {
    name = 'tradeFix41617477851630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rank" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "rank" ADD "mhpRank" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rank" ADD "gbpRank" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rank" ADD "gbp" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rank" DROP COLUMN "gbp"`);
        await queryRunner.query(`ALTER TABLE "rank" DROP COLUMN "gbpRank"`);
        await queryRunner.query(`ALTER TABLE "rank" DROP COLUMN "mhpRank"`);
        await queryRunner.query(`ALTER TABLE "rank" ADD "rank" integer NOT NULL`);
    }

}
