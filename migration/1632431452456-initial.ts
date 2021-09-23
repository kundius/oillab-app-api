import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1632431452456 implements MigrationInterface {
    name = 'initial1632431452456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`oillab\`.\`report\` (\`id\` char(36) NOT NULL, \`number\` int NOT NULL, \`lubricant\` varchar(255) NOT NULL, \`stateNumber\` varchar(255) NOT NULL, \`totalMileage\` varchar(255) NOT NULL, \`lubricantMileage\` varchar(255) NOT NULL, \`samplingNodes\` varchar(255) NOT NULL, \`note\` text NULL, \`sampledAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`clientId\` char(36) NULL, \`vehicleId\` char(36) NULL, \`laboratoryResultId\` char(36) NULL, \`expressLaboratoryResultId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`oillab\`.\`vehicle\` (\`id\` char(36) NOT NULL, \`model\` varchar(255) NOT NULL, \`releaseYear\` varchar(255) NOT NULL, \`stateNumber\` varchar(255) NOT NULL, \`engineModel\` varchar(255) NOT NULL, \`generalOperatingTime\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ownerId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`oillab\`.\`user\` (\`id\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`role\` enum ('Member', 'Administrator') NOT NULL DEFAULT 'Member', \`password\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`lastActivityAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`oillab\`.\`file\` (\`id\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`type\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` ADD CONSTRAINT \`FK_36d650cd64835565719673e2721\` FOREIGN KEY (\`clientId\`) REFERENCES \`oillab\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` ADD CONSTRAINT \`FK_59d3ad44a823b6b236d0385a602\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`oillab\`.\`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` ADD CONSTRAINT \`FK_09633408cd696a5b20a6425ae28\` FOREIGN KEY (\`laboratoryResultId\`) REFERENCES \`oillab\`.\`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` ADD CONSTRAINT \`FK_51d0561d7971011ab3f33f9e7f4\` FOREIGN KEY (\`expressLaboratoryResultId\`) REFERENCES \`oillab\`.\`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`vehicle\` ADD CONSTRAINT \`FK_61e825bc57f59788efc068a6134\` FOREIGN KEY (\`ownerId\`) REFERENCES \`oillab\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`file\` ADD CONSTRAINT \`FK_b2d8e683f020f61115edea206b3\` FOREIGN KEY (\`userId\`) REFERENCES \`oillab\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`file\` DROP FOREIGN KEY \`FK_b2d8e683f020f61115edea206b3\``);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`vehicle\` DROP FOREIGN KEY \`FK_61e825bc57f59788efc068a6134\``);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` DROP FOREIGN KEY \`FK_51d0561d7971011ab3f33f9e7f4\``);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` DROP FOREIGN KEY \`FK_09633408cd696a5b20a6425ae28\``);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` DROP FOREIGN KEY \`FK_59d3ad44a823b6b236d0385a602\``);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`report\` DROP FOREIGN KEY \`FK_36d650cd64835565719673e2721\``);
        await queryRunner.query(`DROP TABLE \`oillab\`.\`file\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`oillab\`.\`user\``);
        await queryRunner.query(`DROP TABLE \`oillab\`.\`user\``);
        await queryRunner.query(`DROP TABLE \`oillab\`.\`vehicle\``);
        await queryRunner.query(`DROP TABLE \`oillab\`.\`report\``);
    }

}
