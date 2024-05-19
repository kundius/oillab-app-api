import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBrandToUser1716151624510 implements MigrationInterface {
    name = 'AddBrandToUser1716151624510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_brands_brand\` (\`userId\` int NOT NULL, \`brandId\` int NOT NULL, INDEX \`IDX_d736cfe8cbfb88a2f091fb9226\` (\`userId\`), INDEX \`IDX_6fb0a350dbb892403acb757e07\` (\`brandId\`), PRIMARY KEY (\`userId\`, \`brandId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_brands_brand\` ADD CONSTRAINT \`FK_d736cfe8cbfb88a2f091fb9226f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_brands_brand\` ADD CONSTRAINT \`FK_6fb0a350dbb892403acb757e070\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_brands_brand\` DROP FOREIGN KEY \`FK_6fb0a350dbb892403acb757e070\``);
        await queryRunner.query(`ALTER TABLE \`user_brands_brand\` DROP FOREIGN KEY \`FK_d736cfe8cbfb88a2f091fb9226f\``);
        await queryRunner.query(`DROP INDEX \`IDX_6fb0a350dbb892403acb757e07\` ON \`user_brands_brand\``);
        await queryRunner.query(`DROP INDEX \`IDX_d736cfe8cbfb88a2f091fb9226\` ON \`user_brands_brand\``);
        await queryRunner.query(`DROP TABLE \`user_brands_brand\``);
    }

}
