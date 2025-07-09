import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyMenusType1751948323873 implements MigrationInterface {
    name = 'ModifyMenusType1751948323873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`broadcasts\` CHANGE \`team_one\` \`team_one\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` CHANGE \`team_two\` \`team_two\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` CHANGE \`etc\` \`etc\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`stores\` DROP COLUMN \`menus\``);
        await queryRunner.query(`ALTER TABLE \`stores\` ADD \`menus\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`stores\` CHANGE \`description\` \`description\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stores\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`stores\` DROP COLUMN \`menus\``);
        await queryRunner.query(`ALTER TABLE \`stores\` ADD \`menus\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` CHANGE \`etc\` \`etc\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` CHANGE \`team_two\` \`team_two\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` CHANGE \`team_one\` \`team_one\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
