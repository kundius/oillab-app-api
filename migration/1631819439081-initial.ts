import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1631819439081 implements MigrationInterface {
    name = 'initial1631819439081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lubricant" character varying NOT NULL, "stateNumber" character varying NOT NULL, "totalMileage" character varying NOT NULL, "lubricantMileage" character varying NOT NULL, "samplingNodes" character varying NOT NULL, "note" text, "sampledAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientId" uuid, "vehicleId" uuid, "laboratoryResultId" uuid, "expressLaboratoryResultId" uuid, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" character varying NOT NULL, "releaseYear" character varying NOT NULL, "stateNumber" character varying NOT NULL, "engineModel" character varying NOT NULL, "generalOperatingTime" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "role" "user_role_enum" NOT NULL DEFAULT 'Member', "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "lastActivityAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "path" character varying NOT NULL, "url" character varying NOT NULL, "size" integer NOT NULL, "type" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_36d650cd64835565719673e2721" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_59d3ad44a823b6b236d0385a602" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_09633408cd696a5b20a6425ae28" FOREIGN KEY ("laboratoryResultId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_51d0561d7971011ab3f33f9e7f4" FOREIGN KEY ("expressLaboratoryResultId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_61e825bc57f59788efc068a6134" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_b2d8e683f020f61115edea206b3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_b2d8e683f020f61115edea206b3"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_61e825bc57f59788efc068a6134"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_51d0561d7971011ab3f33f9e7f4"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_09633408cd696a5b20a6425ae28"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_59d3ad44a823b6b236d0385a602"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_36d650cd64835565719673e2721"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "report"`);
    }

}
