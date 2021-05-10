import {MigrationInterface, QueryRunner} from "typeorm";

export class redditNew1619035218090 implements MigrationInterface {
    name = 'redditNew1619035218090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reddit_new" ("id" SERIAL NOT NULL, "username" character varying(20) NOT NULL, "reddit_id" character varying(20) NOT NULL, "title" character varying(500) NOT NULL, "url" character varying(1000) NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "UQ_c947d1e8dffc61247e98192f28d" UNIQUE ("url"), CONSTRAINT "PK_94229d5386a54eaa7ed40b52c27" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reddit_new"`);
    }

}
