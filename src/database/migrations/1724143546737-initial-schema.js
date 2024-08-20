const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialSchema1724143546737 {
    name = 'InitialSchema1724143546737'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "verified" boolean NOT NULL DEFAULT (0), "active" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
