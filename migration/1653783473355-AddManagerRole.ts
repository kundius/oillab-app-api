import {MigrationInterface, QueryRunner} from "typeorm";

export class AddManagerRole1653783473355 implements MigrationInterface {
    name = 'AddManagerRole1653783473355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('Member', 'Administrator', 'Manager') NOT NULL DEFAULT 'Member'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('Member', 'Administrator') NOT NULL DEFAULT ''Member''`);
    }

}
