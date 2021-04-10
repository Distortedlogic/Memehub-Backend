import {MigrationInterface, QueryRunner} from "typeorm";

export class lastPost1618072937114 implements MigrationInterface {
    name = 'lastPost1618072937114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "lastHivePost" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastMemehubPost" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastMemehubPost"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastHivePost"`);
    }

}
