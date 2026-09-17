const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data', 'reservations.db');

function ensureDatabaseDirectory() {
  const dir = path.dirname(DB_PATH);
  fs.mkdirSync(dir, { recursive: true });
}

function openDatabase() {
  ensureDatabaseDirectory();

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (error) => {
      if (error) {
        reject(error);
        return;
      }

      db.run(
        `CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT UNIQUE NOT NULL,
          food TEXT NOT NULL,
          createdAt TEXT NOT NULL
        )`,
        (createError) => {
          if (createError) {
            reject(createError);
            return;
          }

          resolve(db);
        }
      );
    });
  });
}

async function saveReservation(date, food) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO reservations (date, food, createdAt) VALUES (?, ?, ?)',
      [date, food, new Date().toISOString()],
      function (error) {
        if (error) {
          const duplicateMessage = 'UNIQUE constraint failed: reservations.date';

          if (String(error.message).includes('UNIQUE')) {
            const customError = new Error('La fecha ya está reservada.');
            customError.code = 'DATE_ALREADY_RESERVED';
            reject(customError);
            return;
          }

          reject(error);
          return;
        }

        resolve({ date, food });
      }
    );
  });
}

async function listReservations() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    db.all('SELECT date, food, createdAt FROM reservations ORDER BY createdAt DESC', (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

module.exports = {
  saveReservation,
  listReservations,
};
