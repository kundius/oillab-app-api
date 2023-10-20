import {MigrationInterface, QueryRunner} from "typeorm";

export class resultIndicator1696503257657 implements MigrationInterface {
    name = 'resultIndicator1696503257657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result_indicator\` DROP COLUMN \`value\``);
        await queryRunner.query(`ALTER TABLE \`result_indicator\` ADD \`value\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result_indicator\` DROP COLUMN \`value\``);
        await queryRunner.query(`ALTER TABLE \`result_indicator\` ADD \`value\` varchar(255) NOT NULL`);
    }

}
