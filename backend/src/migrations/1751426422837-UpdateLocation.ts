import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLocation1751426422837 implements MigrationInterface {
    name = 'UpdateLocation1751426422837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`stores_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`img_url\` varchar(255) NOT NULL, \`is_main\` tinyint NOT NULL, \`store_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`favorites\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, \`store_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`leagues\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`sport_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sports\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`is_team_competition\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`broadcasts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`match_date\` date NOT NULL, \`match_time\` time NOT NULL, \`team_one\` varchar(255) NULL, \`team_two\` varchar(255) NULL, \`etc\` text NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`store_id\` int NOT NULL, \`sport_id\` int NOT NULL, \`league_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`business_numbers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`business_number\` varchar(255) NOT NULL, \`is_valid\` tinyint NOT NULL, UNIQUE INDEX \`IDX_a342f076ae20bbac0ce9ba5c6d\` (\`business_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`small_regions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`big_region_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`big_regions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`store_name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`lat\` float NOT NULL, \`lng\` float NOT NULL, \`phone\` varchar(255) NOT NULL, \`opening_hours\` varchar(255) NOT NULL, \`menus\` text NOT NULL, \`type\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`user_id\` int NOT NULL, \`business_number_id\` int NOT NULL, \`big_region_id\` int NOT NULL, \`small_region_id\` int NOT NULL, UNIQUE INDEX \`REL_2a4e434b26878590c4cc871cee\` (\`business_number_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`stores_images\` ADD CONSTRAINT \`fk_storeimage_store\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorites\` ADD CONSTRAINT \`fk_favorite_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorites\` ADD CONSTRAINT \`fk_favorite_store\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`leagues\` ADD CONSTRAINT \`fk_league_sport\` FOREIGN KEY (\`sport_id\`) REFERENCES \`sports\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` ADD CONSTRAINT \`fk_broadcast_store\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` ADD CONSTRAINT \`fk_broadcast_sport\` FOREIGN KEY (\`sport_id\`) REFERENCES \`sports\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` ADD CONSTRAINT \`fk_broadcast_league\` FOREIGN KEY (\`league_id\`) REFERENCES \`leagues\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`small_regions\` ADD CONSTRAINT \`fk_smallregion_bigregion\` FOREIGN KEY (\`big_region_id\`) REFERENCES \`big_regions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stores\` ADD CONSTRAINT \`fk_store_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stores\` ADD CONSTRAINT \`fk_store_business_number\` FOREIGN KEY (\`business_number_id\`) REFERENCES \`business_numbers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stores\` ADD CONSTRAINT \`fk_store_bigregion\` FOREIGN KEY (\`big_region_id\`) REFERENCES \`big_regions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stores\` ADD CONSTRAINT \`fk_store_smallregion\` FOREIGN KEY (\`small_region_id\`) REFERENCES \`small_regions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stores\` DROP FOREIGN KEY \`fk_store_smallregion\``);
        await queryRunner.query(`ALTER TABLE \`stores\` DROP FOREIGN KEY \`fk_store_bigregion\``);
        await queryRunner.query(`ALTER TABLE \`stores\` DROP FOREIGN KEY \`fk_store_business_number\``);
        await queryRunner.query(`ALTER TABLE \`stores\` DROP FOREIGN KEY \`fk_store_user\``);
        await queryRunner.query(`ALTER TABLE \`small_regions\` DROP FOREIGN KEY \`fk_smallregion_bigregion\``);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` DROP FOREIGN KEY \`fk_broadcast_league\``);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` DROP FOREIGN KEY \`fk_broadcast_sport\``);
        await queryRunner.query(`ALTER TABLE \`broadcasts\` DROP FOREIGN KEY \`fk_broadcast_store\``);
        await queryRunner.query(`ALTER TABLE \`leagues\` DROP FOREIGN KEY \`fk_league_sport\``);
        await queryRunner.query(`ALTER TABLE \`favorites\` DROP FOREIGN KEY \`fk_favorite_store\``);
        await queryRunner.query(`ALTER TABLE \`favorites\` DROP FOREIGN KEY \`fk_favorite_user\``);
        await queryRunner.query(`ALTER TABLE \`stores_images\` DROP FOREIGN KEY \`fk_storeimage_store\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_2a4e434b26878590c4cc871cee\` ON \`stores\``);
        await queryRunner.query(`DROP TABLE \`stores\``);
        await queryRunner.query(`DROP TABLE \`big_regions\``);
        await queryRunner.query(`DROP TABLE \`small_regions\``);
        await queryRunner.query(`DROP INDEX \`IDX_a342f076ae20bbac0ce9ba5c6d\` ON \`business_numbers\``);
        await queryRunner.query(`DROP TABLE \`business_numbers\``);
        await queryRunner.query(`DROP TABLE \`broadcasts\``);
        await queryRunner.query(`DROP TABLE \`sports\``);
        await queryRunner.query(`DROP TABLE \`leagues\``);
        await queryRunner.query(`DROP TABLE \`favorites\``);
        await queryRunner.query(`DROP TABLE \`stores_images\``);
    }

}
