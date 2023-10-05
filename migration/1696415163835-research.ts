import {MigrationInterface, QueryRunner} from "typeorm";

export class research1696415163835 implements MigrationInterface {
    name = 'research1696415163835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`oillab\`.\`oil_type_research\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`oilTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`oil_type_research\` ADD CONSTRAINT \`FK_7416baee171b6f7c1df14b76d07\` FOREIGN KEY (\`oilTypeId\`) REFERENCES \`oillab\`.\`oil_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`oil_type_research\` DROP FOREIGN KEY \`FK_7416baee171b6f7c1df14b76d07\``);
        await queryRunner.query(`DROP TABLE \`oillab\`.\`oil_type_research\``);
    }

}
