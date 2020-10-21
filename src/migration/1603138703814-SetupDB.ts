import {MigrationInterface, QueryRunner} from "typeorm";

export class SetupDB1603138703814 implements MigrationInterface {
    name = 'SetupDB1603138703814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_vote" ("userId" integer NOT NULL, "commentId" integer NOT NULL, "upvote" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9194f426d41fb9a8abc3aae5114" PRIMARY KEY ("userId", "commentId"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "userId" integer NOT NULL, "memeId" integer, "ups" integer NOT NULL DEFAULT 0, "downs" integer NOT NULL DEFAULT 0, "ratio" double precision NOT NULL DEFAULT 1, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b8012f5cf6f444a52179e1227a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "itos" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_203e44938fbeadbc89a147ab9a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meme_vote" ("userId" integer NOT NULL, "memeId" integer NOT NULL, "upvote" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_fad1b295b4177343b2b25863375" PRIMARY KEY ("userId", "memeId"))`);
        await queryRunner.query(`CREATE TABLE "memes" ("id" SERIAL NOT NULL, "title" character varying, "url" character varying NOT NULL, "templateId" integer, "baseTemplateId" integer, "contestId" integer, "userId" integer NOT NULL, "season" integer, "clanId" integer, "community" character varying, "numComments" integer NOT NULL DEFAULT 0, "ups" integer NOT NULL DEFAULT 0, "downs" integer NOT NULL DEFAULT 0, "ratio" double precision NOT NULL DEFAULT 1, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3379dc7d8e8dd8e68037a6e63ea" UNIQUE ("url"), CONSTRAINT "PK_12846fb6620e0a6a8ff699db4fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clans" ("id" SERIAL NOT NULL, "creatorId" integer NOT NULL, "name" character varying NOT NULL, "size" integer NOT NULL DEFAULT 1, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d198f00cf9d1743a58fc23d420e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("followerId" integer NOT NULL, "followingId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_105079775692df1f8799ed0fac8" PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE TABLE "rank" ("createdAt" TIMESTAMP NOT NULL, "userId" integer NOT NULL, "rank" integer NOT NULL, "totalPoints" integer NOT NULL, CONSTRAINT "PK_7972aa60c43eaaf760a8f5fd1b8" PRIMARY KEY ("createdAt", "userId"))`);
        await queryRunner.query(`CREATE TABLE "wagers" ("id" SERIAL NOT NULL, "market" character varying NOT NULL, "userId" integer NOT NULL, "position" integer NOT NULL, "entry" double precision NOT NULL, "closedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "exit" double precision NOT NULL, CONSTRAINT "PK_2a22416f9356af58909ae940bb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "isHive" boolean NOT NULL DEFAULT false, "email" character varying, "username" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '/defaultAvatar.png', "clanCreatedId" integer, "rankId" integer, "clanId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying, "numFollowing" integer NOT NULL DEFAULT 0, "numFollowers" integer NOT NULL DEFAULT 0, "numMemeVotesGiven" integer NOT NULL DEFAULT 0, "numMemeUpvotesRecieved" integer NOT NULL DEFAULT 0, "numMemeDownvotesRecieved" integer NOT NULL DEFAULT 0, "numMemeCommentsRecieved" integer NOT NULL DEFAULT 0, "numCommentVotesGiven" integer NOT NULL DEFAULT 0, "numCommentUpvotesRecieved" integer NOT NULL DEFAULT 0, "numCommentDownvotesRecieved" integer NOT NULL DEFAULT 0, "totalPoints" integer NOT NULL DEFAULT 0, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "page"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "baseMemeId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "itoId" integer`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "season" integer`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "isStonk" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "templates_name_key"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_ade7498b89296b9fb63bcd8dbdd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_5d77d92a6925ae3fc8da14e1257" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_c4a6770e9033985e7a5752ffd78" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "FK_fc1b114b78f0bfc3ab7dd9be8bc" FOREIGN KEY ("itoId") REFERENCES "itos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meme_vote" ADD CONSTRAINT "FK_e420fd1ee9d33bcd4e04495e051" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meme_vote" ADD CONSTRAINT "FK_d8c0baa27ba874416652c2c8a7e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memes" ADD CONSTRAINT "FK_a3bfd78cdaaa332eb834323d4fc" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memes" ADD CONSTRAINT "FK_2a3617c8f6b36bf6f80b8d6b85c" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memes" ADD CONSTRAINT "FK_e7d3cfd6ce88708c47f43ca5b60" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memes" ADD CONSTRAINT "FK_d571551c3076cea1b7a89d293a0" FOREIGN KEY ("clanId") REFERENCES "clans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wagers" ADD CONSTRAINT "FK_291cf5eb6a2324eacb019920b17" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d4fdfc9444487bbccc2dfdb8596" FOREIGN KEY ("clanId") REFERENCES "clans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d4fdfc9444487bbccc2dfdb8596"`);
        await queryRunner.query(`ALTER TABLE "wagers" DROP CONSTRAINT "FK_291cf5eb6a2324eacb019920b17"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`);
        await queryRunner.query(`ALTER TABLE "memes" DROP CONSTRAINT "FK_d571551c3076cea1b7a89d293a0"`);
        await queryRunner.query(`ALTER TABLE "memes" DROP CONSTRAINT "FK_e7d3cfd6ce88708c47f43ca5b60"`);
        await queryRunner.query(`ALTER TABLE "memes" DROP CONSTRAINT "FK_2a3617c8f6b36bf6f80b8d6b85c"`);
        await queryRunner.query(`ALTER TABLE "memes" DROP CONSTRAINT "FK_a3bfd78cdaaa332eb834323d4fc"`);
        await queryRunner.query(`ALTER TABLE "meme_vote" DROP CONSTRAINT "FK_d8c0baa27ba874416652c2c8a7e"`);
        await queryRunner.query(`ALTER TABLE "meme_vote" DROP CONSTRAINT "FK_e420fd1ee9d33bcd4e04495e051"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "FK_fc1b114b78f0bfc3ab7dd9be8bc"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_c4a6770e9033985e7a5752ffd78"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_5d77d92a6925ae3fc8da14e1257"`);
        await queryRunner.query(`ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_ade7498b89296b9fb63bcd8dbdd"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "templates_name_key" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "isStonk"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "season"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "itoId"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "baseMemeId"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "page" character varying(100) NOT NULL`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "wagers"`);
        await queryRunner.query(`DROP TABLE "rank"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "clans"`);
        await queryRunner.query(`DROP TABLE "memes"`);
        await queryRunner.query(`DROP TABLE "meme_vote"`);
        await queryRunner.query(`DROP TABLE "itos"`);
        await queryRunner.query(`DROP TABLE "contests"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "comment_vote"`);
    }

}
