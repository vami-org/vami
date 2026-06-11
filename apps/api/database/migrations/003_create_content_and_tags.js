export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255),
      slug VARCHAR(255) UNIQUE NOT NULL,
      body_json JSONB NOT NULL,
      body_text TEXT NOT NULL,
      cover_image_url VARCHAR(255),
      status VARCHAR(20) DEFAULT 'draft',
      visibility VARCHAR(20) DEFAULT 'public',
      seo_title VARCHAR(255),
      seo_description VARCHAR(255),
      canonical_url VARCHAR(255),
      read_time_minutes INTEGER DEFAULT 0,
      read_completion_rate NUMERIC(5, 2) DEFAULT 0.00,
      quality_score NUMERIC(5, 2) DEFAULT 0.00,
      moderation_signals JSONB,
      scheduled_at TIMESTAMP WITH TIME ZONE,
      published_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS article_revisions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      body_json JSONB NOT NULL,
      word_count INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tags (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(50) UNIQUE NOT NULL,
      slug VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS article_tags (
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS media_files (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
      file_url VARCHAR(255) NOT NULL,
      file_name VARCHAR(255),
      mime_type VARCHAR(100),
      file_size_bytes INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS article_media (
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      media_file_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, media_file_id)
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_article_revisions_article_id ON article_revisions(article_id);
    CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DROP TABLE IF EXISTS article_media CASCADE;
    DROP TABLE IF EXISTS media_files CASCADE;
    DROP TABLE IF EXISTS article_tags CASCADE;
    DROP TABLE IF EXISTS tags CASCADE;
    DROP TABLE IF EXISTS article_revisions CASCADE;
    DROP TABLE IF EXISTS articles CASCADE;
  `);
}
