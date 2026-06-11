export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS platform_memberships (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
      stripe_customer_id VARCHAR(255) NOT NULL,
      tier VARCHAR(20) NOT NULL,
      status VARCHAR(50) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE,
      renewed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS creator_tiers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price_cents INTEGER NOT NULL,
      stripe_product_id VARCHAR(255),
      stripe_price_id VARCHAR(255),
      interval VARCHAR(20) DEFAULT 'month',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS creator_subscriptions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      creator_tier_id UUID NOT NULL REFERENCES creator_tiers(id) ON DELETE CASCADE,
      stripe_subscription_id VARCHAR(255) UNIQUE,
      status VARCHAR(50) NOT NULL,
      renewed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS follow_relationships (
      follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (follower_id, following_id)
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_platform_memberships_user_id ON platform_memberships(user_id);
    CREATE INDEX IF NOT EXISTS idx_creator_tiers_creator_id ON creator_tiers(creator_id);
    CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_user_id ON creator_subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_follow_relationships_following_id ON follow_relationships(following_id);
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DROP TABLE IF EXISTS follow_relationships CASCADE;
    DROP TABLE IF EXISTS creator_subscriptions CASCADE;
    DROP TABLE IF EXISTS creator_tiers CASCADE;
    DROP TABLE IF EXISTS platform_memberships CASCADE;
  `);
}
