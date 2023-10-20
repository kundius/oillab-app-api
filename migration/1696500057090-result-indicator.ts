import {MigrationInterface, QueryRunner} from "typeorm";

export class resultIndicator1696500057090 implements MigrationInterface {
    name = 'resultIndicator1696500057090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`result_indicator\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, \`oilTypeIndicatorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`result_indicator\` ADD CONSTRAINT \`FK_757fb4a90153b21bd9f6b1e772d\` FOREIGN KEY (\`oilTypeIndicatorId\`) REFERENCES \`oil_type_indicator\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result_indicator\` DROP FOREIGN KEY \`FK_757fb4a90153b21bd9f6b1e772d\``);
        await queryRunner.query(`DROP TABLE \`result_indicator\``);
    }

}
