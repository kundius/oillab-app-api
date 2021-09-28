import {MigrationInterface, QueryRunner} from "typeorm";

export class updateFields1632846364614 implements MigrationInterface {
    name = 'updateFields1632846364614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`stateNumber\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`generalOperatingTime\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_36d650cd64835565719673e2721\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_59d3ad44a823b6b236d0385a602\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_09633408cd696a5b20a6425ae28\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_51d0561d7971011ab3f33f9e7f4\``);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`clientId\` \`clientId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`vehicleId\` \`vehicleId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`laboratoryResultId\` \`laboratoryResultId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`expressLaboratoryResultId\` \`expressLaboratoryResultId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP FOREIGN KEY \`FK_61e825bc57f59788efc068a6134\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`ownerId\` \`ownerId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_b2d8e683f020f61115edea206b3\``);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`type\` \`type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`userId\` \`userId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_36d650cd64835565719673e2721\` FOREIGN KEY (\`clientId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_59d3ad44a823b6b236d0385a602\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_09633408cd696a5b20a6425ae28\` FOREIGN KEY (\`laboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_51d0561d7971011ab3f33f9e7f4\` FOREIGN KEY (\`expressLaboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD CONSTRAINT \`FK_61e825bc57f59788efc068a6134\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_b2d8e683f020f61115edea206b3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_b2d8e683f020f61115edea206b3\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP FOREIGN KEY \`FK_61e825bc57f59788efc068a6134\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_51d0561d7971011ab3f33f9e7f4\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_09633408cd696a5b20a6425ae28\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_59d3ad44a823b6b236d0385a602\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_36d650cd64835565719673e2721\``);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`userId\` \`userId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`type\` \`type\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_b2d8e683f020f61115edea206b3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` CHANGE \`ownerId\` \`ownerId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD CONSTRAINT \`FK_61e825bc57f59788efc068a6134\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`expressLaboratoryResultId\` \`expressLaboratoryResultId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`laboratoryResultId\` \`laboratoryResultId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`vehicleId\` \`vehicleId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`clientId\` \`clientId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_51d0561d7971011ab3f33f9e7f4\` FOREIGN KEY (\`expressLaboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_09633408cd696a5b20a6425ae28\` FOREIGN KEY (\`laboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_59d3ad44a823b6b236d0385a602\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_36d650cd64835565719673e2721\` FOREIGN KEY (\`clientId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD \`generalOperatingTime\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`stateNumber\` varchar(255) NOT NULL`);
    }

}
