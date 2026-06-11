export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS article_bookmarks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE (user_id, article_id)
    );

    CREATE TABLE IF NOT EXISTS article_reactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      reaction_type VARCHAR(20) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE (user_id, article_id)
    );

    CREATE TABLE IF NOT EXISTS annotations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      block_id VARCHAR(100) NOT NULL,
      selected_text TEXT NOT NULL,
      note TEXT,
      is_public BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS circles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) UNIQUE NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS circle_members (
      circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (circle_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS circle_posts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
      author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255),
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS circle_post_reactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_id UUID NOT NULL REFERENCES circle_posts(id) ON DELETE CASCADE,
      reaction_type VARCHAR(20) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE (user_id, post_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      block_id VARCHAR(100) NOT NULL,
      parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      type VARCHAR(20) DEFAULT 'comment',
      is_answered BOOLEAN DEFAULT false,
      is_deleted BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comment_reactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_article_bookmarks_user_id ON article_bookmarks(user_id);
    CREATE INDEX IF NOT EXISTS idx_article_reactions_article_id ON article_reactions(article_id);
    CREATE INDEX IF NOT EXISTS idx_annotations_article_id ON annotations(article_id);
    CREATE INDEX IF NOT EXISTS idx_circle_posts_circle_id ON circle_posts(circle_id);
    CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
    CREATE INDEX IF NOT EXISTS idx_comments_block_id ON comments(block_id);
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DROP TABLE IF EXISTS comment_reactions CASCADE;
    DROP TABLE IF EXISTS comments CASCADE;
    DROP TABLE IF EXISTS circle_post_reactions CASCADE;
    DROP TABLE IF EXISTS circle_posts CASCADE;
    DROP TABLE IF EXISTS circle_members CASCADE;
    DROP TABLE IF EXISTS circles CASCADE;
    DROP TABLE IF EXISTS annotations CASCADE;
    DROP TABLE IF EXISTS article_reactions CASCADE;
    DROP TABLE IF EXISTS article_bookmarks CASCADE;
  `);
}
