import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1739121446843 implements MigrationInterface {
    name = 'InitialSchema1739121446843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media_variation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "width" integer, "height" integer, "mediaId" integer)`);
        await queryRunner.query(`CREATE TABLE "album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "slug" varchar NOT NULL, "description" varchar, "start_date" datetime, "end_date" datetime, "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "titleImageId" integer, CONSTRAINT "UQ_173cb64112a0980ce7388e911df" UNIQUE ("slug"), CONSTRAINT "REL_eb9a227f564b6c4e85fb296dbd" UNIQUE ("titleImageId"))`);
        await queryRunner.query(`CREATE TABLE "album_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "albumId" integer, "mediaId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "token" varchar, "verified" boolean NOT NULL DEFAULT (0), "active" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "story" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "slug" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "titleImageId" integer, CONSTRAINT "REL_a75a56326b2c591dcacb2a8e7d" UNIQUE ("titleImageId"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "content" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer)`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authorId" integer NOT NULL, "storyId" integer NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "order" integer NOT NULL DEFAULT (1), "type" varchar CHECK( "type" IN ('HTML','IMAGE','VIDEO','MAP') ) NOT NULL DEFAULT ('HTML'), "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "post_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "postId" integer, "mediaId" integer)`);
        await queryRunner.query(`CREATE TABLE "media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "options" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "content" json NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_media_variation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "width" integer, "height" integer, "mediaId" integer, CONSTRAINT "FK_ea3ae421bae5ea8ee0017fc47cb" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_media_variation"("id", "path", "type", "width", "height", "mediaId") SELECT "id", "path", "type", "width", "height", "mediaId" FROM "media_variation"`);
        await queryRunner.query(`DROP TABLE "media_variation"`);
        await queryRunner.query(`ALTER TABLE "temporary_media_variation" RENAME TO "media_variation"`);
        await queryRunner.query(`CREATE TABLE "temporary_album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "slug" varchar NOT NULL, "description" varchar, "start_date" datetime, "end_date" datetime, "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "titleImageId" integer, CONSTRAINT "UQ_173cb64112a0980ce7388e911df" UNIQUE ("slug"), CONSTRAINT "REL_eb9a227f564b6c4e85fb296dbd" UNIQUE ("titleImageId"), CONSTRAINT "FK_eb9a227f564b6c4e85fb296dbdd" FOREIGN KEY ("titleImageId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_album"("id", "title", "slug", "description", "start_date", "end_date", "active", "created_at", "updated_at", "titleImageId") SELECT "id", "title", "slug", "description", "start_date", "end_date", "active", "created_at", "updated_at", "titleImageId" FROM "album"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`ALTER TABLE "temporary_album" RENAME TO "album"`);
        await queryRunner.query(`CREATE TABLE "temporary_album_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "albumId" integer, "mediaId" integer, CONSTRAINT "FK_55a5d6f5fd2a72421a3676812e3" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_bc9607ec2f948b8011f1c4cfd35" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_album_media"("id", "order", "albumId", "mediaId") SELECT "id", "order", "albumId", "mediaId" FROM "album_media"`);
        await queryRunner.query(`DROP TABLE "album_media"`);
        await queryRunner.query(`ALTER TABLE "temporary_album_media" RENAME TO "album_media"`);
        await queryRunner.query(`CREATE TABLE "temporary_story" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "slug" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "titleImageId" integer, CONSTRAINT "REL_a75a56326b2c591dcacb2a8e7d" UNIQUE ("titleImageId"), CONSTRAINT "FK_a75a56326b2c591dcacb2a8e7df" FOREIGN KEY ("titleImageId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_story"("id", "title", "description", "slug", "active", "created_at", "updated_at", "titleImageId") SELECT "id", "title", "description", "slug", "active", "created_at", "updated_at", "titleImageId" FROM "story"`);
        await queryRunner.query(`DROP TABLE "story"`);
        await queryRunner.query(`ALTER TABLE "temporary_story" RENAME TO "story"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "content" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer, CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "name", "content", "created_at", "postId") SELECT "id", "name", "content", "created_at", "postId" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
        await queryRunner.query(`CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authorId" integer NOT NULL, "storyId" integer NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "order" integer NOT NULL DEFAULT (1), "type" varchar CHECK( "type" IN ('HTML','IMAGE','VIDEO','MAP') ) NOT NULL DEFAULT ('HTML'), "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ccbbf92fd04b3365601d3dd008b" FOREIGN KEY ("storyId") REFERENCES "story" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post"("id", "authorId", "storyId", "title", "content", "order", "type", "active", "created_at", "updated_at") SELECT "id", "authorId", "storyId", "title", "content", "order", "type", "active", "created_at", "updated_at" FROM "post"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "postId" integer, "mediaId" integer, CONSTRAINT "FK_4adcc5190e3b5c7e9001adef3b8" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d75add044882ccf9b5a9d0a11e6" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_media"("id", "order", "postId", "mediaId") SELECT "id", "order", "postId", "mediaId" FROM "post_media"`);
        await queryRunner.query(`DROP TABLE "post_media"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_media" RENAME TO "post_media"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_media" RENAME TO "temporary_post_media"`);
        await queryRunner.query(`CREATE TABLE "post_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "postId" integer, "mediaId" integer)`);
        await queryRunner.query(`INSERT INTO "post_media"("id", "order", "postId", "mediaId") SELECT "id", "order", "postId", "mediaId" FROM "temporary_post_media"`);
        await queryRunner.query(`DROP TABLE "temporary_post_media"`);
        await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authorId" integer NOT NULL, "storyId" integer NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "order" integer NOT NULL DEFAULT (1), "type" varchar CHECK( "type" IN ('HTML','IMAGE','VIDEO','MAP') ) NOT NULL DEFAULT ('HTML'), "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "post"("id", "authorId", "storyId", "title", "content", "order", "type", "active", "created_at", "updated_at") SELECT "id", "authorId", "storyId", "title", "content", "order", "type", "active", "created_at", "updated_at" FROM "temporary_post"`);
        await queryRunner.query(`DROP TABLE "temporary_post"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "content" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "postId" integer)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "name", "content", "created_at", "postId") SELECT "id", "name", "content", "created_at", "postId" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
        await queryRunner.query(`ALTER TABLE "story" RENAME TO "temporary_story"`);
        await queryRunner.query(`CREATE TABLE "story" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "slug" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "titleImageId" integer, CONSTRAINT "REL_a75a56326b2c591dcacb2a8e7d" UNIQUE ("titleImageId"))`);
        await queryRunner.query(`INSERT INTO "story"("id", "title", "description", "slug", "active", "created_at", "updated_at", "titleImageId") SELECT "id", "title", "description", "slug", "active", "created_at", "updated_at", "titleImageId" FROM "temporary_story"`);
        await queryRunner.query(`DROP TABLE "temporary_story"`);
        await queryRunner.query(`ALTER TABLE "album_media" RENAME TO "temporary_album_media"`);
        await queryRunner.query(`CREATE TABLE "album_media" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "order" integer NOT NULL DEFAULT (0), "albumId" integer, "mediaId" integer)`);
        await queryRunner.query(`INSERT INTO "album_media"("id", "order", "albumId", "mediaId") SELECT "id", "order", "albumId", "mediaId" FROM "temporary_album_media"`);
        await queryRunner.query(`DROP TABLE "temporary_album_media"`);
        await queryRunner.query(`ALTER TABLE "album" RENAME TO "temporary_album"`);
        await queryRunner.query(`CREATE TABLE "album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "slug" varchar NOT NULL, "description" varchar, "start_date" datetime, "end_date" datetime, "active" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "titleImageId" integer, CONSTRAINT "UQ_173cb64112a0980ce7388e911df" UNIQUE ("slug"), CONSTRAINT "REL_eb9a227f564b6c4e85fb296dbd" UNIQUE ("titleImageId"))`);
        await queryRunner.query(`INSERT INTO "album"("id", "title", "slug", "description", "start_date", "end_date", "active", "created_at", "updated_at", "titleImageId") SELECT "id", "title", "slug", "description", "start_date", "end_date", "active", "created_at", "updated_at", "titleImageId" FROM "temporary_album"`);
        await queryRunner.query(`DROP TABLE "temporary_album"`);
        await queryRunner.query(`ALTER TABLE "media_variation" RENAME TO "temporary_media_variation"`);
        await queryRunner.query(`CREATE TABLE "media_variation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "path" varchar NOT NULL, "type" varchar NOT NULL, "width" integer, "height" integer, "mediaId" integer)`);
        await queryRunner.query(`INSERT INTO "media_variation"("id", "path", "type", "width", "height", "mediaId") SELECT "id", "path", "type", "width", "height", "mediaId" FROM "temporary_media_variation"`);
        await queryRunner.query(`DROP TABLE "temporary_media_variation"`);
        await queryRunner.query(`DROP TABLE "options"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "post_media"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "story"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "album_media"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "media_variation"`);
    }

}
