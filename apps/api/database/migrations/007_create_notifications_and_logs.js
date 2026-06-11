export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      data_json JSONB NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notification_preferences (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      email_newsletter BOOLEAN DEFAULT true,
      email_follower BOOLEAN DEFAULT true,
      email_comment BOOLEAN DEFAULT true,
      email_reaction BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS newsletter_sends (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS email_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      recipient_email VARCHAR(255) NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      meta_json JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ai_usage_log (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      feature_name VARCHAR(50) NOT NULL,
      prompt_tokens INTEGER NOT NULL,
      completion_tokens INTEGER NOT NULL,
      cost_cents NUMERIC(10, 6) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS article_ai_summaries (
      article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
      summary TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      ip_address VARCHAR(45),
      details_json JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Graceful fallback check for vector extension in article_embeddings:
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
        CREATE TABLE IF NOT EXISTS article_embeddings (
          article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
          embedding vector(1536) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      ELSE
        -- Fallback to standard double precision array if pgvector is missing
        CREATE TABLE IF NOT EXISTS article_embeddings (
          article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
          embedding double precision[] NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      END IF;
    END;
    $$;

    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_ai_usage_log_user_id ON ai_usage_log(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DROP TABLE IF EXISTS article_embeddings CASCADE;
    DROP TABLE IF EXISTS audit_log CASCADE;
    DROP TABLE IF EXISTS article_ai_summaries CASCADE;
    DROP TABLE IF EXISTS ai_usage_log CASCADE;
    DROP TABLE IF EXISTS email_events CASCADE;
    DROP TABLE IF EXISTS newsletter_sends CASCADE;
    DROP TABLE IF EXISTS notification_preferences CASCADE;
    DROP TABLE IF EXISTS notifications CASCADE;
  `);
}
