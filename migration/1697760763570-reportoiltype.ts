import {MigrationInterface, QueryRunner} from "typeorm";

export class reportoiltype1697760763570 implements MigrationInterface {
    name = 'reportoiltype1697760763570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`oilTypeId\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`oilTypeId\``);
    }

}
