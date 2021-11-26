import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1637190887467 implements MigrationInterface {
    name = 'SchemaSync1637190887467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
    }

}
