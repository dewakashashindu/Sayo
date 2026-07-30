import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  // Move the check inside main and return early
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL is not defined in .env file!');
    rl.close();
    return;
  }

  console.log('\n==================================');
  console.log('   CREATE NEW ADMIN ACCOUNT');
  console.log('==================================\n');

  const username = await askQuestion('👤 Enter Admin Username: ');
  const password = await askQuestion('🔒 Enter Admin Password: ');

  if (!username.trim() || !password.trim()) {
    console.error('\n❌ Error: Username and Password cannot be empty!\n');
    rl.close();
    return;
  }

  console.log('\n🔄 Encrypting password and saving to Database...');

  const hashedPassword = await bcrypt.hash(password, 10);

  let connection;
  try {
    // Now TypeScript knows connectionString is defined
    connection = await mysql.createConnection(connectionString);

    const query = `
      INSERT INTO Admin (username, passwordHash, updatedAt) 
      VALUES (?, ?, NOW()) 
      ON DUPLICATE KEY UPDATE passwordHash = VALUES(passwordHash), updatedAt = NOW();
    `;

    await connection.execute(query, [username.trim(), hashedPassword]);

    console.log('\n✅ Success! Admin user saved successfully to MySQL Database:');
    console.log(`   Username: ${username.trim()}\n`);
  } catch (error) {
    console.error('\n❌ Error saving admin to DB:', error);
  } finally {
    rl.close();
    if (connection) {
      await connection.end();
    }
  }
}

main();