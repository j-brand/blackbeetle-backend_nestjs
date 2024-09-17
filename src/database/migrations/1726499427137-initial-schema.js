const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialSchema1726499427137 {
    name = 'InitialSchema1726499427137'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "verified" boolean NOT NULL DEFAULT (0), "active" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "media_variation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "width" integer, "height" integer, "mediaId" integer)`);
        await queryRunner.query(`CREATE TABLE "album_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "albumId" integer, "mediaId" integer)`);
        await queryRunner.query(`CREATE TABLE "media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "slug" varchar, "description" varchar, "start_date" datetime, "end_date" datetime, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_173cb64112a0980ce7388e911df" UNIQUE ("slug"))`);
        await queryRunner.query(`CREATE TABLE "temporary_media_variation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "width" integer, "height" integer, "mediaId" integer, CONSTRAINT "FK_ea3ae421bae5ea8ee0017fc47cb" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_media_variation"("id", "path", "type", "width", "height", "mediaId") SELECT "id", "path", "type", "width", "height", "mediaId" FROM "media_variation"`);
        await queryRunner.query(`DROP TABLE "media_variation"`);
        await queryRunner.query(`ALTER TABLE "temporary_media_variation" RENAME TO "media_variation"`);
        await queryRunner.query(`CREATE TABLE "temporary_album_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "albumId" integer, "mediaId" integer, CONSTRAINT "FK_55a5d6f5fd2a72421a3676812e3" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_bc9607ec2f948b8011f1c4cfd35" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_album_media"("id", "order", "albumId", "mediaId") SELECT "id", "order", "albumId", "mediaId" FROM "album_media"`);
        await queryRunner.query(`DROP TABLE "album_media"`);
        await queryRunner.query(`ALTER TABLE "temporary_album_media" RENAME TO "album_media"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "album_media" RENAME TO "temporary_album_media"`);
        await queryRunner.query(`CREATE TABLE "album_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "albumId" integer, "mediaId" integer)`);
        await queryRunner.query(`INSERT INTO "album_media"("id", "order", "albumId", "mediaId") SELECT "id", "order", "albumId", "mediaId" FROM "temporary_album_media"`);
        await queryRunner.query(`DROP TABLE "temporary_album_media"`);
        await queryRunner.query(`ALTER TABLE "media_variation" RENAME TO "temporary_media_variation"`);
        await queryRunner.query(`CREATE TABLE "media_variation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "width" integer, "height" integer, "mediaId" integer)`);
        await queryRunner.query(`INSERT INTO "media_variation"("id", "path", "type", "width", "height", "mediaId") SELECT "id", "path", "type", "width", "height", "mediaId" FROM "temporary_media_variation"`);
        await queryRunner.query(`DROP TABLE "temporary_media_variation"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "album_media"`);
        await queryRunner.query(`DROP TABLE "media_variation"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
