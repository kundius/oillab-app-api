import {MigrationInterface, QueryRunner} from "typeorm";

export class addNumberToReport1632218017171 implements MigrationInterface {
    name = 'addNumberToReport1632218017171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE report_number`);
        await queryRunner.query(`ALTER TABLE "public"."report" ADD "number" integer DEFAULT NEXTVAL('report_number')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."report" DROP COLUMN "number"`);
        await queryRunner.query(`DROP SEQUENCE report_number`);
    }

}
