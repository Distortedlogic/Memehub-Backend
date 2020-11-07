import {MigrationInterface, QueryRunner} from "typeorm";

export class rankCascade1604671605474 implements MigrationInterface {
    name = 'rankCascade1604671605474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_votes" ("userId" uuid NOT NULL, "commentId" uuid NOT NULL, "upvote" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dfdbe89dc8423c08d53bdc1ccfb" PRIMARY KEY ("userId", "commentId"))`);
        await queryRunner.query(`CREATE TABLE "meme_votes" ("userId" uuid NOT NULL, "memeId" uuid NOT NULL, "upvote" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_1bceebcdb80e8b1c8e3af20a52f" PRIMARY KEY ("userId", "memeId"))`);
        await queryRunner.query(`ALTER TABLE "comment_votes" ADD CONSTRAINT "FK_c70cad98b28ff8502621ad0e6f3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_votes" ADD CONSTRAINT "FK_db0f40562fcbaec17222882574b" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meme_votes" ADD CONSTRAINT "FK_e024686bd59a70909a06c936265" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meme_votes" ADD CONSTRAINT "FK_04d90b5353df8af5a6641f871c4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meme_votes" DROP CONSTRAINT "FK_04d90b5353df8af5a6641f871c4"`);
        await queryRunner.query(`ALTER TABLE "meme_votes" DROP CONSTRAINT "FK_e024686bd59a70909a06c936265"`);
        await queryRunner.query(`ALTER TABLE "comment_votes" DROP CONSTRAINT "FK_db0f40562fcbaec17222882574b"`);
        await queryRunner.query(`ALTER TABLE "comment_votes" DROP CONSTRAINT "FK_c70cad98b28ff8502621ad0e6f3"`);
        await queryRunner.query(`DROP TABLE "meme_votes"`);
        await queryRunner.query(`DROP TABLE "comment_votes"`);
    }

}
