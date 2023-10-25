import {MigrationInterface, QueryRunner} from "typeorm";

export class resultresearches1698252806374 implements MigrationInterface {
    name = 'resultresearches1698252806374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`result_research\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` text NULL, \`resultId\` int NULL, \`oilTypeResearchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`result_research\``);
    }

}
