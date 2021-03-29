import {MigrationInterface, QueryRunner} from "typeorm";

export class marketFix41616956904954 implements MigrationInterface {
    name = 'marketFix41616956904954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rank" RENAME COLUMN "totalPoints" TO "mhp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totalPoints"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mhp" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gbp" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gbp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mhp"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "totalPoints" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "rank" RENAME COLUMN "mhp" TO "totalPoints"`);
    }

}
