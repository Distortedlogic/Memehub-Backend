import {MigrationInterface, QueryRunner} from "typeorm";

export class commentPermlink1604412081643 implements MigrationInterface {
    name = 'commentPermlink1604412081643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "permlink" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "permlink"`);
    }

}
