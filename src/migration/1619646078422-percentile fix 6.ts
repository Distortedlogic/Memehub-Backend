import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix61619646078422 implements MigrationInterface {
    name = 'percentileFix61619646078422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "type"`);
    }

}
