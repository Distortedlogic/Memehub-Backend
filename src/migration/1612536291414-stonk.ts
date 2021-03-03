import {MigrationInterface, QueryRunner} from "typeorm";

export class stonk1612536291414 implements MigrationInterface {
    name = 'stonk1612536291414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" ADD "stonk" character varying`);
        await queryRunner.query(`ALTER TABLE "memes" ADD "version" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "memes" DROP COLUMN "stonk"`);
    }

}
