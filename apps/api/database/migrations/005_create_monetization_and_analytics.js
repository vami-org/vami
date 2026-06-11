export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS partner_pool_periods (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      total_pool_cents INTEGER NOT NULL,
      is_calculated BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS article_earnings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      period_id UUID NOT NULL REFERENCES partner_pool_periods(id) ON DELETE CASCADE,
      earnings_cents INTEGER NOT NULL,
      breakdown_json JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS creator_payouts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      payout_cents INTEGER NOT NULL,
      stripe_transfer_id VARCHAR(255),
      status VARCHAR(50) NOT NULL,
      failure_reason TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS stripe_events (
      id VARCHAR(255) PRIMARY KEY,
      processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reading_sessions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      session_id VARCHAR(100) NOT NULL,
      scroll_depth_percent NUMERIC(5, 2) DEFAULT 0.00,
      is_completed BOOLEAN DEFAULT false,
      read_time_seconds INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_article_earnings_article_id ON article_earnings(article_id);
    CREATE INDEX IF NOT EXISTS idx_creator_payouts_creator_id ON creator_payouts(creator_id);
    CREATE INDEX IF NOT EXISTS idx_reading_sessions_article_id ON reading_sessions(article_id);
    CREATE INDEX IF NOT EXISTS idx_reading_sessions_session_id ON reading_sessions(session_id);
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DROP TABLE IF EXISTS reading_sessions CASCADE;
    DROP TABLE IF EXISTS stripe_events CASCADE;
    DROP TABLE IF EXISTS creator_payouts CASCADE;
    DROP TABLE IF EXISTS article_earnings CASCADE;
    DROP TABLE IF EXISTS partner_pool_periods CASCADE;
  `);
}
