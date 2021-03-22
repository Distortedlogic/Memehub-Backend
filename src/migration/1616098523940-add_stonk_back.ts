import {MigrationInterface, QueryRunner} from "typeorm";

export class addStonkBack1616098523940 implements MigrationInterface {
    name = 'addStonkBack1616098523940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "stonk" boolean`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "stonk_correct" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "stonk_correct"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "stonk"`);
    }

}
