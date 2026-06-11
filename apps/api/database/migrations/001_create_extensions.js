export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `);
  pgm.sql(`
    DO $$
    BEGIN
      CREATE EXTENSION IF NOT EXISTS "vector";
    EXCEPTION
      WHEN others THEN
        RAISE WARNING 'vector extension could not be enabled: %', SQLERRM;
    END;
    $$;
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DO $$
    BEGIN
      DROP EXTENSION IF EXISTS "vector";
    EXCEPTION
      WHEN others THEN
        NULL;
    END;
    $$;
    DROP EXTENSION IF EXISTS "uuid-ossp";
  `);
}
