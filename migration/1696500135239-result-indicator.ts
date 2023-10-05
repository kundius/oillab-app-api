import {MigrationInterface, QueryRunner} from "typeorm";

export class resultIndicator1696500135239 implements MigrationInterface {
    name = 'resultIndicator1696500135239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`result_indicator\` ADD \`resultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`result_indicator\` ADD CONSTRAINT \`FK_d24755203211752ef94582ebf43\` FOREIGN KEY (\`resultId\`) REFERENCES \`oillab\`.\`result\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`result_indicator\` DROP FOREIGN KEY \`FK_d24755203211752ef94582ebf43\``);
        await queryRunner.query(`ALTER TABLE \`oillab\`.\`result_indicator\` DROP COLUMN \`resultId\``);
    }

}
