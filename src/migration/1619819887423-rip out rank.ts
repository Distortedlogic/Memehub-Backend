import {MigrationInterface, QueryRunner} from "typeorm";

export class ripOutRank1619819887423 implements MigrationInterface {
    name = 'ripOutRank1619819887423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numMemeVotesGiven"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numMemeUpvotesRecieved"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numMemeDownvotesRecieved"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numMemeCommentsRecieved"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numCommentVotesGiven"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numCommentUpvotesRecieved"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "numCommentDownvotesRecieved"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mhp"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gbp" SET DEFAULT 500`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gbp" SET DEFAULT 100000`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mhp" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numCommentDownvotesRecieved" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numCommentUpvotesRecieved" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numCommentVotesGiven" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numMemeCommentsRecieved" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numMemeDownvotesRecieved" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numMemeUpvotesRecieved" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users" ADD "numMemeVotesGiven" integer NOT NULL DEFAULT 0`);
    }

}
