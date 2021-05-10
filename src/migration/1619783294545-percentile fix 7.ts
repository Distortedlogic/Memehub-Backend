import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix71619783294545 implements MigrationInterface {
    name = 'percentileFix71619783294545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "season" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "season" DROP NOT NULL`);
    }

}
