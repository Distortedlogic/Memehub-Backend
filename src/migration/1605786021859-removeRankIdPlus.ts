import {MigrationInterface, QueryRunner} from "typeorm";

export class removeRankIdPlus1605786021859 implements MigrationInterface {
    name = 'removeRankIdPlus1605786021859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rankId"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT 'https://memehub.s3.amazonaws.com/memehub/misc/defaultAvatar.png'`);
        await queryRunner.query(`ALTER TABLE "memes" ALTER COLUMN "community" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" ALTER COLUMN "community" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT '/defaultAvatar.png'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rankId" integer`);
    }

}
