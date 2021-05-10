import {MigrationInterface, QueryRunner} from "typeorm";

export class percentileFix51619629014717 implements MigrationInterface {
    name = 'percentileFix51619629014717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "target" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ALTER COLUMN "target" SET NOT NULL`);
    }

}
