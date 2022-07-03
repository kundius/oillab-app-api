import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCustomerField1656795173986 implements MigrationInterface {
    name = 'AddCustomerField1656795173986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerOrganization\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerPhone\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerPerson\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerEmail\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD CONSTRAINT \`FK_996a84242df6a86dd97d3d03f8e\` FOREIGN KEY (\`customerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP FOREIGN KEY \`FK_996a84242df6a86dd97d3d03f8e\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerId\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerEmail\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerPerson\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerPhone\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerOrganization\` text NULL DEFAULT 'NULL'`);
    }

}
