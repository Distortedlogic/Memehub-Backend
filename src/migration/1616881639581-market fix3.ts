import {MigrationInterface, QueryRunner} from "typeorm";

export class marketFix31616881639581 implements MigrationInterface {
    name = 'marketFix31616881639581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" RENAME COLUMN "totalUpvotes" TO "numUpvotes"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" RENAME COLUMN "numUpvotes" TO "totalUpvotes"`);
    }

}
