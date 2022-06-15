import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApplicationForm1653838294520 implements MigrationInterface {
    name = 'AddApplicationForm1653838294520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`report_application_form\` (\`id\` int NOT NULL AUTO_INCREMENT, \`customerOrganization\` text NULL, \`customerPhone\` text NULL, \`customerPerson\` text NULL, \`customerEmail\` text NULL, \`vehicleEquipmentManufacturer\` text NULL, \`vehicleRegistrationNumber\` text NULL, \`vehicleEquipmentModel\` text NULL, \`vehicleTotalOperatingTime\` text NULL, \`vehicleSamplingPoint\` text NULL, \`vehicleTotalOperatingTimeLubricant\` text NULL, \`vehicleLiquidVolume\` text NULL, \`vehicleToppingUpLubricant\` text NULL, \`lubricantBrand\` text NULL, \`lubricantViscosity\` text NULL, \`lubricantModel\` text NULL, \`lubricantState\` text NULL, \`selectionBrand\` text NULL, \`selectionVolume\` text NULL, \`selectionPlace\` text NULL, \`note\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`applicationFormId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD UNIQUE INDEX \`IDX_adb99fdba42b80994fcbf53d9e\` (\`applicationFormId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_adb99fdba42b80994fcbf53d9e\` ON \`report\` (\`applicationFormId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`REL_adb99fdba42b80994fcbf53d9e\` ON \`report\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP INDEX \`IDX_adb99fdba42b80994fcbf53d9e\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`applicationFormId\``);
        await queryRunner.query(`DROP TABLE \`report_application_form\``);
    }

}
