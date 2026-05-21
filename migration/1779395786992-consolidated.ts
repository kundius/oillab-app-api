import { MigrationInterface, QueryRunner } from "typeorm";

export class Consolidated1779395786992 implements MigrationInterface {
    name = 'Consolidated1779395786992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`consolidatedLaboratoryResultId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_d6db6cea1701e8bc95029b31bb9\` FOREIGN KEY (\`consolidatedLaboratoryResultId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_d6db6cea1701e8bc95029b31bb9\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`consolidatedLaboratoryResultId\``);
    }

}
