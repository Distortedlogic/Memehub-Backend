import {MigrationInterface, QueryRunner} from "typeorm";

export class tradeFix1617380347729 implements MigrationInterface {
    name = 'tradeFix1617380347729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "entry"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "exit"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "position" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_b09eef25e1f2cc0ca543e80fbe6"`);
        await queryRunner.query(`ALTER TABLE "trades" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_b09eef25e1f2cc0ca543e80fbe6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_b09eef25e1f2cc0ca543e80fbe6"`);
        await queryRunner.query(`ALTER TABLE "trades" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_b09eef25e1f2cc0ca543e80fbe6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "exit" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trades" ADD "entry" double precision NOT NULL`);
    }

}
