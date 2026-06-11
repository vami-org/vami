export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;
    ALTER TABLE follow_relationships ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'accepted';
  `);
}

export async function down(pgm) {
  pgm.sql(`
    ALTER TABLE follow_relationships DROP COLUMN IF EXISTS status;
    ALTER TABLE users DROP COLUMN IF EXISTS is_private;
  `);
}
