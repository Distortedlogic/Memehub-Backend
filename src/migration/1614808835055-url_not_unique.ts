import {MigrationInterface, QueryRunner} from "typeorm";

export class urlNotUnique1614808835055 implements MigrationInterface {
    name = 'urlNotUnique1614808835055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" DROP CONSTRAINT "UQ_3379dc7d8e8dd8e68037a6e63ea"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" ADD CONSTRAINT "UQ_3379dc7d8e8dd8e68037a6e63ea" UNIQUE ("url")`);
    }

}
