import {MigrationInterface, QueryRunner} from "typeorm";

export class marketFix11616862921125 implements MigrationInterface {
    name = 'marketFix11616862921125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_515948649ce0bbbe391de702ae5"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_5624219dd33b4644599d4d4b231" PRIMARY KEY ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_5624219dd33b4644599d4d4b231"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id")`);
    }

}
