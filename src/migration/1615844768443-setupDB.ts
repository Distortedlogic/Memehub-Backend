import {MigrationInterface, QueryRunner} from "typeorm";

export class setupDB1615844768443 implements MigrationInterface {
    name = 'setupDB1615844768443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_votes" ("userId" uuid NOT NULL, "commentId" uuid NOT NULL, "upvote" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dfdbe89dc8423c08d53bdc1ccfb" PRIMARY KEY ("userId", "commentId"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("followerId" uuid NOT NULL, "followingId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_105079775692df1f8799ed0fac8" PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE TABLE "meme_votes" ("userId" uuid NOT NULL, "memeId" uuid NOT NULL, "upvote" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_1bceebcdb80e8b1c8e3af20a52f" PRIMARY KEY ("userId", "memeId"))`);
        await queryRunner.query(`CREATE TABLE "rank" ("createdAt" TIMESTAMP NOT NULL, "userId" character varying NOT NULL, "timeFrame" character varying NOT NULL, "rank" integer NOT NULL, "totalPoints" integer NOT NULL, CONSTRAINT "PK_890c6fe74925bff7643977f1d10" PRIMARY KEY ("createdAt", "userId", "timeFrame"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "isHive" boolean NOT NULL DEFAULT false, "verified" boolean NOT NULL DEFAULT false, "email" character varying, "username" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT 'https://memehub.s3.amazonaws.com/memehub/misc/defaultAvatar.png', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying, "numFollowing" integer NOT NULL DEFAULT 0, "numFollowers" integer NOT NULL DEFAULT 0, "numMemeVotesGiven" integer NOT NULL DEFAULT 0, "numMemeUpvotesRecieved" integer NOT NULL DEFAULT 0, "numMemeDownvotesRecieved" integer NOT NULL DEFAULT 0, "numMemeCommentsRecieved" integer NOT NULL DEFAULT 0, "numCommentVotesGiven" integer NOT NULL DEFAULT 0, "numCommentUpvotesRecieved" integer NOT NULL DEFAULT 0, "numCommentDownvotesRecieved" integer NOT NULL DEFAULT 0, "totalPoints" integer NOT NULL DEFAULT 0, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL, "text" character varying NOT NULL, "isHive" boolean NOT NULL DEFAULT false, "permlink" character varying, "userId" uuid NOT NULL, "memeId" uuid, "ups" integer NOT NULL DEFAULT 0, "downs" integer NOT NULL DEFAULT 0, "ratio" double precision NOT NULL DEFAULT 1, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "memes" ("id" uuid NOT NULL, "isHive" boolean NOT NULL DEFAULT false, "title" character varying, "ocrText" character varying, "url" character varying NOT NULL, "userId" uuid NOT NULL, "meme_clf" character varying, "meme_clf_correct" boolean, "version" character varying, "season" integer, "community" character varying NOT NULL, "numComments" integer NOT NULL DEFAULT 0, "ups" integer NOT NULL DEFAULT 0, "downs" integer NOT NULL DEFAULT 0, "ratio" double precision NOT NULL DEFAULT 1, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_12846fb6620e0a6a8ff699db4fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "emojis" ("name" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d0441182ac78cc27978dd5f4536" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "reddit_scores" ("id" SERIAL NOT NULL, "username" character varying(20) NOT NULL, "subreddit" character varying(50) NOT NULL, "time_delta" integer NOT NULL, "timestamp" integer NOT NULL, "datetime" TIMESTAMP NOT NULL, "final_score" double precision NOT NULL, "raw_score" double precision NOT NULL, "num_in_bottom" integer NOT NULL, "num_in_top" integer NOT NULL, "shitposter_index" double precision NOT NULL, "highest_upvotes" integer NOT NULL, "hu_score" double precision NOT NULL, "lowest_ratio" double precision NOT NULL, "redditor_id" integer, "redditorId" integer, CONSTRAINT "PK_6ee18c3e5f54447fff6721e5b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "redditors" ("id" SERIAL NOT NULL, "username" character varying(20) NOT NULL, CONSTRAINT "UQ_12ea821277fb068de87556497b0" UNIQUE ("username"), CONSTRAINT "PK_061583869ba792c2095b65c671f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reddit_memes" ("id" SERIAL NOT NULL, "username" character varying(20) NOT NULL, "reddit_id" character varying(20) NOT NULL, "subreddit" character varying(50) NOT NULL, "title" character varying(500) NOT NULL, "url" character varying(1000) NOT NULL, "meme_text" character varying(1000000), "is_a_template" boolean, "meme_clf" character varying(100), "meme_clf_correct" boolean, "version" character varying(20), "timestamp" integer NOT NULL, "created_at" TIMESTAMP NOT NULL, "upvote_ratio" double precision NOT NULL, "upvotes" integer NOT NULL, "downvotes" integer NOT NULL, "num_comments" integer NOT NULL, "redditor_id" integer, "redditorId" integer, CONSTRAINT "PK_1ae085193dc492081d372e0299c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment_votes" ADD CONSTRAINT "FK_c70cad98b28ff8502621ad0e6f3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_votes" ADD CONSTRAINT "FK_db0f40562fcbaec17222882574b" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meme_votes" ADD CONSTRAINT "FK_e024686bd59a70909a06c936265" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meme_votes" ADD CONSTRAINT "FK_04d90b5353df8af5a6641f871c4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_c4a6770e9033985e7a5752ffd78" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memes" ADD CONSTRAINT "FK_e7d3cfd6ce88708c47f43ca5b60" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reddit_scores" ADD CONSTRAINT "FK_3f7dae7cf8a8d6a42c8536835ef" FOREIGN KEY ("redditorId") REFERENCES "redditors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reddit_memes" ADD CONSTRAINT "FK_bf7cf84ba2e7414fdadddae5d47" FOREIGN KEY ("redditorId") REFERENCES "redditors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reddit_memes" DROP CONSTRAINT "FK_bf7cf84ba2e7414fdadddae5d47"`);
        await queryRunner.query(`ALTER TABLE "reddit_scores" DROP CONSTRAINT "FK_3f7dae7cf8a8d6a42c8536835ef"`);
        await queryRunner.query(`ALTER TABLE "memes" DROP CONSTRAINT "FK_e7d3cfd6ce88708c47f43ca5b60"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_c4a6770e9033985e7a5752ffd78"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "meme_votes" DROP CONSTRAINT "FK_04d90b5353df8af5a6641f871c4"`);
        await queryRunner.query(`ALTER TABLE "meme_votes" DROP CONSTRAINT "FK_e024686bd59a70909a06c936265"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`);
        await queryRunner.query(`ALTER TABLE "comment_votes" DROP CONSTRAINT "FK_db0f40562fcbaec17222882574b"`);
        await queryRunner.query(`ALTER TABLE "comment_votes" DROP CONSTRAINT "FK_c70cad98b28ff8502621ad0e6f3"`);
        await queryRunner.query(`DROP TABLE "reddit_memes"`);
        await queryRunner.query(`DROP TABLE "redditors"`);
        await queryRunner.query(`DROP TABLE "reddit_scores"`);
        await queryRunner.query(`DROP TABLE "emojis"`);
        await queryRunner.query(`DROP TABLE "memes"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "rank"`);
        await queryRunner.query(`DROP TABLE "meme_votes"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "comment_votes"`);
    }

}
