import {MigrationInterface, QueryRunner} from "typeorm";

export class tradeFix31617396242671 implements MigrationInterface {
    name = 'tradeFix31617396242671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "FK_c6bf1faafab022259ba6a60188b"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_4102cf053de0864cf8503b8e1c6"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "templateName"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "templateName"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_66ce369c11fa932d0d0b2747725"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "FK_fc59f8eba258e6124c19116739b" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_2f60217726d5d7c69dd5e7c0323" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_2f60217726d5d7c69dd5e7c0323"`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "FK_fc59f8eba258e6124c19116739b"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_515948649ce0bbbe391de702ae5"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_66ce369c11fa932d0d0b2747725" PRIMARY KEY ("id", "name")`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "templateName" character varying`);
        await queryRunner.query(`ALTER TABLE "market" ADD "templateName" character varying`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_4102cf053de0864cf8503b8e1c6" FOREIGN KEY ("templateName", "templateId") REFERENCES "templates"("name","id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "FK_c6bf1faafab022259ba6a60188b" FOREIGN KEY ("templateName", "templateId") REFERENCES "templates"("name","id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
