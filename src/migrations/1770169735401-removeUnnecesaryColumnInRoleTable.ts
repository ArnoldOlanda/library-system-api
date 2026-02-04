import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUnnecesaryColumnInRoleTable1770169735401 implements MigrationInterface {
    name = 'RemoveUnnecesaryColumnInRoleTable1770169735401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "otherField"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "otherField" character varying`);
    }

}
