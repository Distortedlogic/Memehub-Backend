import {MigrationInterface, QueryRunner} from "typeorm";

export class investments1619048569528 implements MigrationInterface {
    name = 'investments1619048569528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investments" ("id" uuid NOT NULL, "redditId" character varying NOT NULL, "betSize" integer NOT NULL, "odds" double precision NOT NULL, "percentile" double precision, "userId" uuid NOT NULL, "season" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1263853f1a4fb8b849c1c9aff4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c"`);
        await queryRunner.query(`DROP TABLE "investments"`);
    }

}
