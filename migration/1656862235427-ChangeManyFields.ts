import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeManyFields1656862235427 implements MigrationInterface {
    name = 'ChangeManyFields1656862235427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`lubricant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`model\` varchar(255) NOT NULL, \`brand\` varchar(255) NOT NULL, \`viscosity\` text NULL, \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerOrganization\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerPhone\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerPerson\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerEmail\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`vehicleEquipmentManufacturer\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`vehicleRegistrationNumber\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`vehicleEquipmentModel\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`vehicleTotalOperatingTime\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`vehicleTotalOperatingTimeLubricant\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`vehicleLiquidVolume\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantBrand\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantViscosity\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantModel\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`selectionBrand\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`selectionPlace\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`productType\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`lubricantEntityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD \`liquidVolume\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`organization\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phone\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`organization\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`liquidVolume\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`lubricantEntityId\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`selectionPlace\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`selectionBrand\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantModel\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantViscosity\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantBrand\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`vehicleLiquidVolume\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`vehicleTotalOperatingTimeLubricant\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`vehicleTotalOperatingTime\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`vehicleEquipmentModel\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`vehicleRegistrationNumber\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`vehicleEquipmentManufacturer\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerEmail\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerPerson\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerPhone\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerOrganization\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`lubricant\``);
    }

}
