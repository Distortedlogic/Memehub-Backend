import {MigrationInterface, QueryRunner} from "typeorm";

export class tradeTemplate1617387328977 implements MigrationInterface {
    name = 'tradeTemplate1617387328977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" ADD "templateName" character varying`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_a4f11659a1ffcc9b1f4c21322f7" FOREIGN KEY ("templateName") REFERENCES "templates"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_a4f11659a1ffcc9b1f4c21322f7"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "templateName"`);
    }

}
