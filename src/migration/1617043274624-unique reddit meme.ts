import {MigrationInterface, QueryRunner} from "typeorm";

export class uniqueRedditMeme1617043274624 implements MigrationInterface {
    name = 'uniqueRedditMeme1617043274624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_d9fabb3062c2d1e0ba5672e37a8"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_a96cb53a8dc66ed332f5799d21a" PRIMARY KEY ("createdAt", "name", "subsource")`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "source"`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_a96cb53a8dc66ed332f5799d21a"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_5fc754460eb3abfee9521a44985" PRIMARY KEY ("createdAt", "name")`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "subsource"`);
        await queryRunner.query(`ALTER TABLE "market" ADD "templateName" character varying`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD CONSTRAINT "UQ_80fc13a6facb2e40853bc5ce717" UNIQUE ("url")`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "FK_1a4cc598faeb1ab612317b6c1df" FOREIGN KEY ("templateName") REFERENCES "templates"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "FK_1a4cc598faeb1ab612317b6c1df"`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP CONSTRAINT "UQ_80fc13a6facb2e40853bc5ce717"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "templateName"`);
        await queryRunner.query(`ALTER TABLE "market" ADD "subsource" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_5fc754460eb3abfee9521a44985"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_a96cb53a8dc66ed332f5799d21a" PRIMARY KEY ("createdAt", "name", "subsource")`);
        await queryRunner.query(`ALTER TABLE "market" ADD "source" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "PK_a96cb53a8dc66ed332f5799d21a"`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "PK_d9fabb3062c2d1e0ba5672e37a8" PRIMARY KEY ("createdAt", "name", "source", "subsource")`);
    }

}
