import {MigrationInterface, QueryRunner} from "typeorm";

export class color1700750497189 implements MigrationInterface {
    name = 'color1700750497189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillabg9_oillab\`.\`result_research\` ADD \`color\` enum ('Green', 'Yellow', 'Red', 'White') NULL`);
        await queryRunner.query(`ALTER TABLE \`oillabg9_oillab\`.\`result_indicator\` ADD \`color\` enum ('Green', 'Yellow', 'Red', 'White') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oillabg9_oillab\`.\`result_indicator\` DROP COLUMN \`color\``);
        await queryRunner.query(`ALTER TABLE \`oillabg9_oillab\`.\`result_research\` DROP COLUMN \`color\``);
    }

}
