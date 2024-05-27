const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/tickets.db');

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
