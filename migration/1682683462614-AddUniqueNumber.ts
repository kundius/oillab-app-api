import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueNumber1682683462614 implements MigrationInterface {
    name = 'AddUniqueNumber1682683462614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`uniqueNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD UNIQUE INDEX \`IDX_fa11ee18bd030eb56af78ae3cb\` (\`uniqueNumber\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP INDEX \`IDX_fa11ee18bd030eb56af78ae3cb\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`uniqueNumber\``);
    }

}
