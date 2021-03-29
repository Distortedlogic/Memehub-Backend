import {MigrationInterface, QueryRunner} from "typeorm";

export class marketFix21616865232945 implements MigrationInterface {
    name = 'marketFix21616865232945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" ADD "numPosts" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "market" ADD "totalUpvotes" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "totalUpvotes"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "numPosts"`);
    }

}
