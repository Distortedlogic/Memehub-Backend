import {MigrationInterface, QueryRunner} from "typeorm";

export class officialResults1617060996735 implements MigrationInterface {
    name = 'officialResults1617060996735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "stonk_official" character varying`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "is_a_template_official" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "is_a_template_official"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "stonk_official"`);
    }

}
