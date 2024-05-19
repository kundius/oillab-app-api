import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBrand1716118261675 implements MigrationInterface {
    name = 'AddBrand1716118261675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`lubricant\` ADD \`brandEntityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`lubricant\` ADD CONSTRAINT \`FK_c0ffac1116ad9c269257f54abb8\` FOREIGN KEY (\`brandEntityId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lubricant\` DROP FOREIGN KEY \`FK_c0ffac1116ad9c269257f54abb8\``);
        await queryRunner.query(`ALTER TABLE \`lubricant\` DROP COLUMN \`brandEntityId\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
    }

}
