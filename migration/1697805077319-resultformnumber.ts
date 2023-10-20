import {MigrationInterface, QueryRunner} from "typeorm";

export class resultformnumber1697805077319 implements MigrationInterface {
    name = 'resultformnumber1697805077319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result\` CHANGE \`number\` \`formNumber\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result\` CHANGE \`formNumber\` \`number\` varchar(255) NOT NULL`);
    }

}
