const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Ensure the /tmp directory exists and copy the database file there
const dbPath = path.join('/tmp', 'tickets.db');
const srcDbPath = path.join(__dirname, 'data', 'tickets.db');

if (!fs.existsSync(dbPath)) {
  fs.copyFileSync(srcDbPath, dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  } else {
    console.log('Database connected successfully.');
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticketNumber TEXT,
    ticketType TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    amount INTEGER,
    total INTEGER,
    transactionScreenshot TEXT
  )`);
});

module.exports = db;
