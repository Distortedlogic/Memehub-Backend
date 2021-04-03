import {MigrationInterface, QueryRunner} from "typeorm";

export class tradeFix21617395662410 implements MigrationInterface {
    name = 'tradeFix21617395662410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "FK_1a4cc598faeb1ab612317b6c1df"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_a4f11659a1ffcc9b1f4c21322f7"`);
        await queryRunner.query(`ALTER TABLE "market" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_5fc754460eb3abfee9521a44985"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_a3490ff682fc43aa09b804d796f" PRIMARY KEY ("createdAt", "name", "id")`);
        await queryRunner.query(`ALTER TABLE "market" ADD "templateId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_5624219dd33b4644599d4d4b231"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_66ce369c11fa932d0d0b2747725" PRIMARY KEY ("name", "id")`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "templateId" uuid`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_a3490ff682fc43aa09b804d796f"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_c2b1b521e6a91c52d7513aa2e8a" PRIMARY KEY ("createdAt", "id")`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_c2b1b521e6a91c52d7513aa2e8a"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "FK_c6bf1faafab022259ba6a60188b" FOREIGN KEY ("templateId", "templateName") REFERENCES "templates"("id","name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_4102cf053de0864cf8503b8e1c6" FOREIGN KEY ("templateId", "templateName") REFERENCES "templates"("id","name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_4102cf053de0864cf8503b8e1c6"`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "FK_c6bf1faafab022259ba6a60188b"`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_1e9a2963edfd331d92018e3abac"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_c2b1b521e6a91c52d7513aa2e8a" PRIMARY KEY ("createdAt", "id")`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_c2b1b521e6a91c52d7513aa2e8a"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_a3490ff682fc43aa09b804d796f" PRIMARY KEY ("createdAt", "name", "id")`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "templateId"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_66ce369c11fa932d0d0b2747725"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_5624219dd33b4644599d4d4b231" PRIMARY KEY ("name")`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "templateId"`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_a3490ff682fc43aa09b804d796f"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_5fc754460eb3abfee9521a44985" PRIMARY KEY ("createdAt", "name")`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_a4f11659a1ffcc9b1f4c21322f7" FOREIGN KEY ("templateName") REFERENCES "templates"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "FK_1a4cc598faeb1ab612317b6c1df" FOREIGN KEY ("templateName") REFERENCES "templates"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
