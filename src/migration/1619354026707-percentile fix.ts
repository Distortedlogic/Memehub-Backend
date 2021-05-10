import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix1619354026707 implements MigrationInterface {
    name = 'percentileFix1619354026707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "percentile" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "percentile"`);
    }

}
