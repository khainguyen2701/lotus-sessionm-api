const { Client } = require('pg');

async function checkTables() {
  const client = new Client({
    host: 'pg-384c0722-nguyenvankhai2701-547c.f.aivencloud.com',
    port: 16342,
    user: 'avnadmin',
    password: 'AVNS_XwMvouQO1Cj3lcaBNAI',
    database: 'sessionm-loyalty',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully!');
    
    // Check all tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables in database:');
    if (result.rows.length === 0) {
      console.log('❌ No tables found in database!');
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();