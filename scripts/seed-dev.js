const pg = require("pg");
const { Pool } = pg;

// Connection string is loaded automatically via -r dotenv/config in npm script command
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL is not set in process environment.");
  process.exit(1);
}

console.log("🌱 Starting database seeding process...");

const pool = new Pool({
  connectionString: databaseUrl,
});

async function runSeed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Clean existing tables if needed
    console.log("🧹 Cleaning existing tables...");
    await client.query("TRUNCATE TABLE users, circles CASCADE");

    // 2. Insert mock users
    console.log("👥 Seeding users...");
    const userInsertQuery = `
      INSERT INTO users (id, email, username, display_name, bio, is_creator, creator_tier)
      VALUES 
        ('a1111111-1111-1111-1111-111111111111', 'dev1@vami.org', 'dev1', 'Full-Stack Lead', 'Dev 1 - Architect', true, 'pro'),
        ('b2222222-2222-2222-2222-222222222222', 'dev2@vami.org', 'dev2', 'Frontend Lead', 'Dev 2 - Design System Owner', true, 'pro'),
        ('c3333333-3333-3333-3333-333333333333', 'dev3@vami.org', 'dev3', 'Full-Stack Integrator', 'Dev 3 - AI integration', true, 'pro'),
        ('d4444444-4444-4444-4444-444444444444', 'reader1@vami.org', 'reader1', 'Avid Reader', 'I love reading tech blogs!', false, 'free')
      RETURNING id, username;
    `;
    const usersResult = await client.query(userInsertQuery);
    console.log(`✓ Seeded ${usersResult.rowCount} users.`);

    // 3. Insert mock circles
    console.log("⭕ Seeding circles...");
    const circleInsertQuery = `
      INSERT INTO circles (id, name, slug, description)
      VALUES 
        ('e5555555-5555-5555-5555-555555555555', 'AI Writers', 'ai-writers', 'Discussions around Large Language Models and engineering agentic applications.'),
        ('f6666666-6666-6666-6666-666666666666', 'Design System Architecture', 'design-systems', 'Crafting custom CSS, atomic layout systems, and responsive design.')
      RETURNING id, name;
    `;
    const circlesResult = await client.query(circleInsertQuery);
    console.log(`✓ Seeded ${circlesResult.rowCount} circles.`);

    // 4. Insert mock articles
    console.log("📝 Seeding articles...");
    const articleInsertQuery = `
      INSERT INTO articles (id, author_id, title, subtitle, slug, body_json, body_text, status, visibility, read_time_minutes, published_at)
      VALUES 
        (
          '11112222-3333-4444-5555-666677778888',
          'a1111111-1111-1111-1111-111111111111',
          'Building VAMI: The Engineering Blueprint',
          'From Zero to Production: A detailed implementation roadmap.',
          'vami-engineering-blueprint',
          '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "VAMI is built upon structured guidelines."}]}]}',
          'VAMI is built upon structured guidelines.',
          'published',
          'public',
          5,
          NOW()
        ),
        (
          '99998888-7777-6666-5555-444433332222',
          'b2222222-2222-2222-2222-222222222222',
          'Aesthetics in Web Design',
          'Why generic color palettes fail and custom designs win.',
          'aesthetics-in-web-design',
          '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Generic color scales look dry and uninteresting."}]}]}',
          'Generic color scales look dry and uninteresting.',
          'published',
          'public',
          3,
          NOW()
        )
      RETURNING id, title;
    `;
    const articlesResult = await client.query(articleInsertQuery);
    console.log(`✓ Seeded ${articlesResult.rowCount} articles.`);

    await client.query("COMMIT");
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error during seeding process:", error);
  } finally {
    client.release();
  }
}

runSeed().then(() => pool.end());
