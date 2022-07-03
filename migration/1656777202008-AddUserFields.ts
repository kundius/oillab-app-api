import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserFields1656777202008 implements MigrationInterface {
    name = 'AddUserFields1656777202008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`organization\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phone\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`organization\``);
    }

}
