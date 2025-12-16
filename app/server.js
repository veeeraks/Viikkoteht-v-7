const express = require('express');
const mysql = require('mysql2/promise');

// Lue environment-muuttujat
const {
  DB_HOST = 'db',
  DB_USER = 'root',
  DB_PASSWORD = 'rootpass',
  DB_NAME = 'mydb',
  PORT = 3000
} = process.env;

const app = express();

async function initDatabase() {
  try {
    const pool = await mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Luo visits-taulu, jos sitä ei ole
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Lisää yksi rivi default-arvoilla
    await pool.query(`
      INSERT INTO visits (created_at) VALUES (NOW());
    `);

    console.log('MySQL initialized successfully.');
    return pool;
  } catch (err) {
    console.error('MySQL init failed:', err);
    process.exit(1); // Lopeta sovellus, jos DB ei ole kunnossa
  }
}

async function main() {
  const pool = await initDatabase();

  // Health endpoint
  app.get('/cicd/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Test endpoint: näyttää viimeisimmän visit-rivin
  app.get('/cicd/visits', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM visits ORDER BY id DESC LIMIT 10');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
