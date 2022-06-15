import {MigrationInterface, QueryRunner} from "typeorm";

export class AddReportColor1654894399844 implements MigrationInterface {
    name = 'AddReportColor1654894399844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`color\` enum ('Red', 'Yellow', 'LightGreen') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`color\``);
    }

}
