import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSecuencesTable1771956392345 implements MigrationInterface {
    name = 'CreateSecuencesTable1771956392345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sequences" ("id" uuid NOT NULL, "document_type" character varying(50) NOT NULL, "prefix" character varying(10), "current_number" integer NOT NULL DEFAULT '0', "padding" integer NOT NULL DEFAULT '8', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d19ca45f51bdf4bb6ed35111e1d" UNIQUE ("document_type"), CONSTRAINT "PK_7c7f5d8c822411196242b89bc76" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sequences"`);
    }

}
