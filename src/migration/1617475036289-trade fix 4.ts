import {MigrationInterface, QueryRunner} from "typeorm";

export class tradeFix41617475036289 implements MigrationInterface {
    name = 'tradeFix41617475036289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gbp" SET DEFAULT 100000`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gbp" SET DEFAULT 1200`);
    }

}
