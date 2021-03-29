import {MigrationInterface, QueryRunner} from "typeorm";

export class marketFix51616959138256 implements MigrationInterface {
    name = 'marketFix51616959138256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trades" ("id" uuid NOT NULL, "name" character varying NOT NULL, "entry" double precision NOT NULL, "exit" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numFollowing"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numFollowers"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gbp" SET DEFAULT 1200`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_b09eef25e1f2cc0ca543e80fbe6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_b09eef25e1f2cc0ca543e80fbe6"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gbp" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numFollowers" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numFollowing" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`DROP TABLE "trades"`);
    }

}
