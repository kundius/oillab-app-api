import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateLubricant1656638421358 implements MigrationInterface {
    name = 'CreateLubricant1656638421358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`lubricant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`model\` varchar(255) NOT NULL, \`brand\` varchar(255) NOT NULL, \`viscosity\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantBrand\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantViscosity\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantModel\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantId\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantId\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantModel\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantViscosity\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantBrand\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`lubricant\``);
    }

}
