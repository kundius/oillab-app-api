import {MigrationInterface, QueryRunner} from "typeorm";

export class AddContactPerson1657365849017 implements MigrationInterface {
    name = 'AddContactPerson1657365849017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`organization\` \`contactPerson\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`contactPerson\` \`organization\` text NULL`);
    }

}
