import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeManyFields1656812111505 implements MigrationInterface {
    name = 'ChangeManyFields1656812111505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`productType\``);
        await queryRunner.query(`ALTER TABLE \`lubricant\` ADD \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lubricant\` DROP COLUMN \`productType\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL DEFAULT 'NULL'`);
    }

}
