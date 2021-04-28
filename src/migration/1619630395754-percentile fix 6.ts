import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix61619630395754 implements MigrationInterface {
    name = 'percentileFix61619630395754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" DROP CONSTRAINT "FK_1ac89bd3bcc45f7d854b56058b6"`);
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" DROP CONSTRAINT "FK_43d0531a18cbe3c6d173bdba7d6"`);
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" ADD CONSTRAINT "FK_1ac89bd3bcc45f7d854b56058b6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" ADD CONSTRAINT "FK_43d0531a18cbe3c6d173bdba7d6" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" DROP CONSTRAINT "FK_43d0531a18cbe3c6d173bdba7d6"`);
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" DROP CONSTRAINT "FK_1ac89bd3bcc45f7d854b56058b6"`);
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" ADD CONSTRAINT "FK_43d0531a18cbe3c6d173bdba7d6" FOREIGN KEY ("memeId") REFERENCES "memes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_meme_emojis" ADD CONSTRAINT "FK_1ac89bd3bcc45f7d854b56058b6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
