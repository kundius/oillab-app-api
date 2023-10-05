import {MigrationInterface, QueryRunner} from "typeorm";

export class result1696423290985 implements MigrationInterface {
    name = 'result1696423290985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`oillab\`.\`result\` (\`id\` int NOT NULL AUTO_INCREMENT, \`number\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`oilTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`result\` ADD CONSTRAINT \`FK_42cae48c273e4db32304c3193ce\` FOREIGN KEY (\`oilTypeId\`) REFERENCES \`oillab\`.\`oil_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`result\` DROP FOREIGN KEY \`FK_42cae48c273e4db32304c3193ce\``);
        await queryRunner.query(`DROP TABLE \`oillab\`.\`result\``);
    }

}
