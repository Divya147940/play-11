require('dotenv').config();
const { db } = require('./_src/config/db');

async function checkAdmins() {
  try {
    const { rows } = await db.query("SELECT * FROM admins");
    console.log("Admins found:", rows);
    process.exit(0);
  } catch (error) {
    console.error("Error checking admins:", error);
    process.exit(1);
  }
}

checkAdmins();
