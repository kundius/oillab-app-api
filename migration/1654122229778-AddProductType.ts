import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProductType1654122229778 implements MigrationInterface {
    name = 'AddProductType1654122229778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`productType\``);
    }

}
