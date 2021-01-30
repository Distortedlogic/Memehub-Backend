import {MigrationInterface, QueryRunner} from "typeorm";

export class ocrText1611682613724 implements MigrationInterface {
    name = 'ocrText1611682613724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" ADD "ocrText" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" DROP COLUMN "ocrText"`);
    }

}
