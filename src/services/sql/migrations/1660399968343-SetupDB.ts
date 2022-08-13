import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupDB1660399968343 implements MigrationInterface {
  name = "SetupDB1660399968343";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "external_spotify_url" character varying(100) NOT NULL, "spotify_uri" character varying(100) NOT NULL, "spotify_id" character varying(100) NOT NULL, "image_url" character varying(100) NOT NULL, CONSTRAINT "UQ_fa1657e725d4cfcb8bbacc89445" UNIQUE ("external_spotify_url"), CONSTRAINT "UQ_2b5bf4ccbf8b3064f78e134e030" UNIQUE ("spotify_uri"), CONSTRAINT "UQ_115284ae50e500614eceabe4a21" UNIQUE ("spotify_id"), CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "mood" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "created_by" character varying(100) NOT NULL, "description" character varying(250), "play_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cd069bf46deedf0ef3a7771f44b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "mood_artists_artist" ("mood_id" uuid NOT NULL, "artist_id" uuid NOT NULL, CONSTRAINT "PK_299467a45b71ec66778868bad30" PRIMARY KEY ("mood_id", "artist_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18a436476731b3d54bcb519b3c" ON "mood_artists_artist" ("mood_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a0636b866781802d468318be56" ON "mood_artists_artist" ("artist_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "mood_artists_artist" ADD CONSTRAINT "FK_18a436476731b3d54bcb519b3c3" FOREIGN KEY ("mood_id") REFERENCES "mood"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "mood_artists_artist" ADD CONSTRAINT "FK_a0636b866781802d468318be565" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mood_artists_artist" DROP CONSTRAINT "FK_a0636b866781802d468318be565"`
    );
    await queryRunner.query(
      `ALTER TABLE "mood_artists_artist" DROP CONSTRAINT "FK_18a436476731b3d54bcb519b3c3"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a0636b866781802d468318be56"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_18a436476731b3d54bcb519b3c"`
    );
    await queryRunner.query(`DROP TABLE "mood_artists_artist"`);
    await queryRunner.query(`DROP TABLE "mood"`);
    await queryRunner.query(`DROP TABLE "artist"`);
  }
}
