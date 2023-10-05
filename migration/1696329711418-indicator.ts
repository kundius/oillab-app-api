import {MigrationInterface, QueryRunner} from "typeorm";

export class indicator1696329711418 implements MigrationInterface {
    name = 'indicator1696329711418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`oillab\`.\`oil_type_indicator\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`ntd\` varchar(255) NOT NULL, \`units\` varchar(255) NOT NULL, \`oilTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`oil_type_indicator\` ADD CONSTRAINT \`FK_85cdcb48839eabb38d26b54d482\` FOREIGN KEY (\`oilTypeId\`) REFERENCES \`oillab\`.\`oil_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`oil_type_indicator\` DROP FOREIGN KEY \`FK_85cdcb48839eabb38d26b54d482\``);
        await queryRunner.query(`DROP TABLE \`oillab\`.\`oil_type_indicator\``);
    }

}
