import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeManyFields1656804344474 implements MigrationInterface {
    name = 'ChangeManyFields1656804344474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP FOREIGN KEY \`FK_996a84242df6a86dd97d3d03f8e\``);
        await queryRunner.query(`DROP INDEX \`IDX_adb99fdba42b80994fcbf53d9e\` ON \`report\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`lubricantId\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` DROP COLUMN \`customerId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`lubricantEntityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`productType\` \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleEquipmentManufacturer\` \`vehicleEquipmentManufacturer\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleRegistrationNumber\` \`vehicleRegistrationNumber\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleEquipmentModel\` \`vehicleEquipmentModel\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleTotalOperatingTime\` \`vehicleTotalOperatingTime\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleSamplingPoint\` \`vehicleSamplingPoint\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleTotalOperatingTimeLubricant\` \`vehicleTotalOperatingTimeLubricant\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleLiquidVolume\` \`vehicleLiquidVolume\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleToppingUpLubricant\` \`vehicleToppingUpLubricant\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`lubricantState\` \`lubricantState\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionBrand\` \`selectionBrand\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionVolume\` \`selectionVolume\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionPlace\` \`selectionPlace\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`note\` \`note\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_36d650cd64835565719673e2721\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_59d3ad44a823b6b236d0385a602\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_09633408cd696a5b20a6425ae28\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_51d0561d7971011ab3f33f9e7f4\``);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`color\` \`color\` enum ('Red', 'Yellow', 'LightGreen') NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`number\` \`number\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`clientId\` \`clientId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`vehicleId\` \`vehicleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`laboratoryResultId\` \`laboratoryResultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`expressLaboratoryResultId\` \`expressLaboratoryResultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`applicationFormId\` \`applicationFormId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP FOREIGN KEY \`FK_61e825bc57f59788efc068a6134\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`ownerId\` \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`organization\` \`organization\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_b2d8e683f020f61115edea206b3\``);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`type\` \`type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_36d650cd64835565719673e2721\` FOREIGN KEY (\`clientId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_59d3ad44a823b6b236d0385a602\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_6e5cb63e072366b618996ca3156\` FOREIGN KEY (\`lubricantEntityId\`) REFERENCES \`lubricant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_09633408cd696a5b20a6425ae28\` FOREIGN KEY (\`laboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_51d0561d7971011ab3f33f9e7f4\` FOREIGN KEY (\`expressLaboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_adb99fdba42b80994fcbf53d9e4\` FOREIGN KEY (\`applicationFormId\`) REFERENCES \`report_application_form\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD CONSTRAINT \`FK_61e825bc57f59788efc068a6134\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_b2d8e683f020f61115edea206b3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_b2d8e683f020f61115edea206b3\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP FOREIGN KEY \`FK_61e825bc57f59788efc068a6134\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_adb99fdba42b80994fcbf53d9e4\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_51d0561d7971011ab3f33f9e7f4\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_09633408cd696a5b20a6425ae28\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_6e5cb63e072366b618996ca3156\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_59d3ad44a823b6b236d0385a602\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_36d650cd64835565719673e2721\``);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`type\` \`type\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_b2d8e683f020f61115edea206b3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`organization\` \`organization\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`ownerId\` \`ownerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD CONSTRAINT \`FK_61e825bc57f59788efc068a6134\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`applicationFormId\` \`applicationFormId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`expressLaboratoryResultId\` \`expressLaboratoryResultId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`laboratoryResultId\` \`laboratoryResultId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`vehicleId\` \`vehicleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`clientId\` \`clientId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`number\` \`number\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`color\` \`color\` enum ('Red', 'Yellow', 'LightGreen') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_51d0561d7971011ab3f33f9e7f4\` FOREIGN KEY (\`expressLaboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_09633408cd696a5b20a6425ae28\` FOREIGN KEY (\`laboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_59d3ad44a823b6b236d0385a602\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_36d650cd64835565719673e2721\` FOREIGN KEY (\`clientId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`note\` \`note\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionPlace\` \`selectionPlace\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionVolume\` \`selectionVolume\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionBrand\` \`selectionBrand\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`lubricantState\` \`lubricantState\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleToppingUpLubricant\` \`vehicleToppingUpLubricant\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleLiquidVolume\` \`vehicleLiquidVolume\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleTotalOperatingTimeLubricant\` \`vehicleTotalOperatingTimeLubricant\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleSamplingPoint\` \`vehicleSamplingPoint\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleTotalOperatingTime\` \`vehicleTotalOperatingTime\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleEquipmentModel\` \`vehicleEquipmentModel\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleRegistrationNumber\` \`vehicleRegistrationNumber\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleEquipmentManufacturer\` \`vehicleEquipmentManufacturer\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`productType\` \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`lubricantEntityId\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`customerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD \`lubricantId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_adb99fdba42b80994fcbf53d9e\` ON \`report\` (\`applicationFormId\`)`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` ADD CONSTRAINT \`FK_996a84242df6a86dd97d3d03f8e\` FOREIGN KEY (\`customerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
