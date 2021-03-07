import {MigrationInterface, QueryRunner} from "typeorm";

export class isTemplate1615045782427 implements MigrationInterface {
    name = 'isTemplate1615045782427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD "is_template" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP COLUMN "is_template"`);
    }

}
