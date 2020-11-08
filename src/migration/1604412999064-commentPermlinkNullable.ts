import {MigrationInterface, QueryRunner} from "typeorm";

export class commentPermlinkNullable1604412999064 implements MigrationInterface {
    name = 'commentPermlinkNullable1604412999064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "permlink" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "permlink" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "permlink" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "permlink" SET NOT NULL`);
    }

}
