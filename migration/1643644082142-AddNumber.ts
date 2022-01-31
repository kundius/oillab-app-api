import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNumber1643644082142 implements MigrationInterface {
    name = 'AddNumber1643644082142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`number\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`number\``);
    }

}
