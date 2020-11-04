import {MigrationInterface, QueryRunner} from "typeorm";

export class commentIsHive1604351482646 implements MigrationInterface {
    name = 'commentIsHive1604351482646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "isHive" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "isHive"`);
    }

}
