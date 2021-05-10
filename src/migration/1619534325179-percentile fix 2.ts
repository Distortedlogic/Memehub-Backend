import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix21619534325179 implements MigrationInterface {
    name = 'percentileFix21619534325179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "percentile"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "percentile" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "percentile"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "percentile" integer`);
    }

}
