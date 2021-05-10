import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix41619628543018 implements MigrationInterface {
    name = 'percentileFix41619628543018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ADD "upvotes" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "upvotes"`);
    }

}
