import {MigrationInterface, QueryRunner} from "typeorm";

export class redditMemeAiExpand1613952593064 implements MigrationInterface {
    name = 'redditMemeAiExpand1613952593064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "template"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "meme_clf" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "meme_clf_correct" boolean`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "stonk" boolean`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "stonk_correct" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "stonk_correct"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "stonk"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "meme_clf_correct"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "meme_clf"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "template" character varying(100)`);
    }

}
