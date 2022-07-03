import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeManyFields1656861803313 implements MigrationInterface {
    name = 'ChangeManyFields1656861803313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_36d650cd64835565719673e2721\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_59d3ad44a823b6b236d0385a602\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_09633408cd696a5b20a6425ae28\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_51d0561d7971011ab3f33f9e7f4\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_6e5cb63e072366b618996ca3156\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_61e825bc57f59788efc068a6134\` ON \`vehicle\``);
        await queryRunner.query(`DROP INDEX \`FK_b2d8e683f020f61115edea206b3\` ON \`file\``);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleSamplingPoint\` \`vehicleSamplingPoint\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleToppingUpLubricant\` \`vehicleToppingUpLubricant\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`lubricantState\` \`lubricantState\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionVolume\` \`selectionVolume\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`note\` \`note\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`lubricant\` CHANGE \`viscosity\` \`viscosity\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`lubricant\` CHANGE \`productType\` \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`color\` \`color\` enum ('Red', 'Yellow', 'LightGreen') NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`number\` \`number\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`clientId\` \`clientId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`vehicleId\` \`vehicleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`lubricantEntityId\` \`lubricantEntityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`laboratoryResultId\` \`laboratoryResultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`expressLaboratoryResultId\` \`expressLaboratoryResultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`applicationFormId\` \`applicationFormId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`liquidVolume\` \`liquidVolume\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`ownerId\` \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`organization\` \`organization\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
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
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`organization\` \`organization\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`ownerId\` \`ownerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`liquidVolume\` \`liquidVolume\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`applicationFormId\` \`applicationFormId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`expressLaboratoryResultId\` \`expressLaboratoryResultId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`laboratoryResultId\` \`laboratoryResultId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`lubricantEntityId\` \`lubricantEntityId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`vehicleId\` \`vehicleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`clientId\` \`clientId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`number\` \`number\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`color\` \`color\` enum ('Red', 'Yellow', 'LightGreen') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`lubricant\` CHANGE \`productType\` \`productType\` enum ('Fuel', 'Oil', 'Coolant') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`lubricant\` CHANGE \`viscosity\` \`viscosity\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`note\` \`note\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`selectionVolume\` \`selectionVolume\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`lubricantState\` \`lubricantState\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleToppingUpLubricant\` \`vehicleToppingUpLubricant\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report_application_form\` CHANGE \`vehicleSamplingPoint\` \`vehicleSamplingPoint\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE INDEX \`FK_b2d8e683f020f61115edea206b3\` ON \`file\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_61e825bc57f59788efc068a6134\` ON \`vehicle\` (\`ownerId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_6e5cb63e072366b618996ca3156\` ON \`report\` (\`lubricantEntityId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_51d0561d7971011ab3f33f9e7f4\` ON \`report\` (\`expressLaboratoryResultId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_09633408cd696a5b20a6425ae28\` ON \`report\` (\`laboratoryResultId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_59d3ad44a823b6b236d0385a602\` ON \`report\` (\`vehicleId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_36d650cd64835565719673e2721\` ON \`report\` (\`clientId\`)`);
    }

}
