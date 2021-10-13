import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1634125258255 implements MigrationInterface {
    name = 'initial1634125258255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_5b568f482b26fd0c7f332feb238\``);
        await queryRunner.query(`DROP INDEX \`FK_59d3ad44a823b6b236d0385a602\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_09633408cd696a5b20a6425ae28\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_51d0561d7971011ab3f33f9e7f4\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`FK_61e825bc57f59788efc068a6134\` ON \`vehicle\``);
        await queryRunner.query(`DROP INDEX \`FK_b2d8e683f020f61115edea206b3\` ON \`file\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`vehicleUuid\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`uuid\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`vehicleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`clientId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`laboratoryResultId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`laboratoryResultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`expressLaboratoryResultId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`expressLaboratoryResultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`ownerId\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`type\` \`type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`userId\` int NULL`);
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
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`userId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`type\` \`type\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`id\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastActivityAt\` \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`ownerId\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD \`ownerId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`expressLaboratoryResultId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`expressLaboratoryResultId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`laboratoryResultId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`laboratoryResultId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`clientId\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`note\` \`note\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`id\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`vehicleId\``);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD \`uuid\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicle\` ADD PRIMARY KEY (\`uuid\`)`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`vehicleUuid\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE INDEX \`FK_b2d8e683f020f61115edea206b3\` ON \`file\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_61e825bc57f59788efc068a6134\` ON \`vehicle\` (\`ownerId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_51d0561d7971011ab3f33f9e7f4\` ON \`report\` (\`expressLaboratoryResultId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_09633408cd696a5b20a6425ae28\` ON \`report\` (\`laboratoryResultId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_59d3ad44a823b6b236d0385a602\` ON \`report\` (\`vehicleUuid\`)`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_5b568f482b26fd0c7f332feb238\` FOREIGN KEY (\`vehicleUuid\`) REFERENCES \`vehicle\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
