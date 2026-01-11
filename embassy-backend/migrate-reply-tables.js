import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'zirhmute_embassy',
};

async function createReplyTables() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully!');

    // Create contact_form_replies table
    console.log('\nCreating contact_form_replies table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_form_replies (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        contact_email VARCHAR(255) NOT NULL,
        contact_subject VARCHAR(255),
        contact_message TEXT,
        admin_reply TEXT NOT NULL,
        admin_name VARCHAR(255) NOT NULL,
        replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_contact_email (contact_email),
        INDEX idx_replied_at (replied_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✓ contact_form_replies table created/verified');

    // Create application_replies table
    console.log('\nCreating application_replies table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS application_replies (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        application_id INT UNSIGNED NOT NULL,
        application_type ENUM('visa', 'marriage', 'birth_certificate', 'travel_pass') NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        admin_reply TEXT NOT NULL,
        admin_name VARCHAR(255) NOT NULL,
        replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_application_id (application_id),
        INDEX idx_application_type (application_type),
        INDEX idx_user_email (user_email),
        INDEX idx_replied_at (replied_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✓ application_replies table created/verified');

    // Verify tables exist
    console.log('\nVerifying tables...');
    const [tables] = await connection.query(`
      SELECT TABLE_NAME
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('contact_form_replies', 'application_replies')
    `, [dbConfig.database]);

    console.log('\nFound tables:');
    tables.forEach(table => {
      console.log(`  ✓ ${table.TABLE_NAME}`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run migration
createReplyTables();