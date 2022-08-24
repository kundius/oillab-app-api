import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveApplicationForm1660317857261 implements MigrationInterface {
    name = 'RemoveApplicationForm1660317857261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_adb99fdba42b80994fcbf53d9e\` ON \`report\``);
        await queryRunner.query(`DROP INDEX \`REL_adb99fdba42b80994fcbf53d9e\` ON \`report\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`applicationFormId\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`vehicleToppingUpLubricant\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`lubricantState\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`selectionVolume\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_6e5cb63e072366b618996ca3156\` FOREIGN KEY (\`lubricantEntityId\`) REFERENCES \`lubricant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_6e5cb63e072366b618996ca3156\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`selectionVolume\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`lubricantState\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`vehicleToppingUpLubricant\``);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`applicationFormId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_adb99fdba42b80994fcbf53d9e\` ON \`report\` (\`applicationFormId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_adb99fdba42b80994fcbf53d9e\` ON \`report\` (\`applicationFormId\`)`);
    }

}
