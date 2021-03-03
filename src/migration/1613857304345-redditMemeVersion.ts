import {MigrationInterface, QueryRunner} from "typeorm";

export class redditMemeVersion1613857304345 implements MigrationInterface {
    name = 'redditMemeVersion1613857304345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" RENAME COLUMN "features" TO "version"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "version" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "version" double precision array`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" RENAME COLUMN "version" TO "features"`);
    }

}
