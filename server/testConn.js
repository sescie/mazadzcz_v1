// server/testConn.js
const pool = require('./db');
const dotenv = require('dotenv');
dotenv.config();

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to database!');
    
    // Test simple query
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Query result:', rows[0].solution); // Should show 2
    
    connection.release();
    pool.end(); // Close the pool
  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
}

testConnection();