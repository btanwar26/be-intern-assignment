import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSocialFeatures1771069529879 implements MigrationInterface {
    name = 'AddSocialFeatures1771069529879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tag" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_0b4ef8e83392129fb3373fdb3af" UNIQUE ("tag"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer)`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer)`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer)`);
        await queryRunner.query(`CREATE TABLE "posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer, CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_likes"("id", "createdAt", "userId", "postId") SELECT "id", "createdAt", "userId", "postId" FROM "likes"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_likes" RENAME TO "likes"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer, CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "content", "createdAt", "updatedAt", "authorId") SELECT "id", "content", "createdAt", "updatedAt", "authorId" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
        await queryRunner.query(`CREATE TABLE "temporary_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer, CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_follows"("id", "createdAt", "followerId", "followingId") SELECT "id", "createdAt", "followerId", "followingId" FROM "follows"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_follows" RENAME TO "follows"`);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, CONSTRAINT "FK_c52d9ed78d930e7dc28c5a93cff" FOREIGN KEY ("postsId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4664ee7d5459af42a58502b4139" FOREIGN KEY ("hashtagsId") REFERENCES "hashtags" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "temporary_posts_hashtags_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "posts_hashtags_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts_hashtags_hashtags" RENAME TO "posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`ALTER TABLE "posts_hashtags_hashtags" RENAME TO "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE TABLE "posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "posts_hashtags_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`ALTER TABLE "follows" RENAME TO "temporary_follows"`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer)`);
        await queryRunner.query(`INSERT INTO "follows"("id", "createdAt", "followerId", "followingId") SELECT "id", "createdAt", "followerId", "followingId" FROM "temporary_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_follows"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "content", "createdAt", "updatedAt", "authorId") SELECT "id", "content", "createdAt", "updatedAt", "authorId" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME TO "temporary_likes"`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer)`);
        await queryRunner.query(`INSERT INTO "likes"("id", "createdAt", "userId", "postId") SELECT "id", "createdAt", "userId", "postId" FROM "temporary_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_likes"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`DROP TABLE "posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
    }

}
