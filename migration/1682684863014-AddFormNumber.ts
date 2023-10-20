import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFormNumber1682684863014 implements MigrationInterface {
    name = 'AddFormNumber1682684863014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_fa11ee18bd030eb56af78ae3cb\` ON \`report\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`uniqueNumber\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`formNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD UNIQUE INDEX \`IDX_1160690cc9379463dad9a6a3ed\` (\`formNumber\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP INDEX \`IDX_1160690cc9379463dad9a6a3ed\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`formNumber\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`uniqueNumber\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_fa11ee18bd030eb56af78ae3cb\` ON \`report\` (\`uniqueNumber\`)`);
    }

}
