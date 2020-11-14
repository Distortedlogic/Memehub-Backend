import {MigrationInterface, QueryRunner} from "typeorm";

export class Emojis1605361852364 implements MigrationInterface {
    name = 'Emojis1605361852364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "emojis" ("name" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d0441182ac78cc27978dd5f4536" PRIMARY KEY ("name"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "emojis"`);
    }

}
