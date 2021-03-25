import {MigrationInterface, QueryRunner} from "typeorm";

export class memeIsHive1616686747189 implements MigrationInterface {
    name = 'memeIsHive1616686747189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" DROP COLUMN "community"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memes" ADD "community" character varying NOT NULL`);
    }

}
