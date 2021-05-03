import {MigrationInterface, QueryRunner} from "typeorm";

export class addYolo1619823883041 implements MigrationInterface {
    name = 'addYolo1619823883041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ADD "isYolo" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "isYolo"`);
    }

}
