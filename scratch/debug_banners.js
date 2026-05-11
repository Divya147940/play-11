const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), 'server', '.env') });
const { db } = require(path.join(process.cwd(), 'server', '_src', 'config', 'db'));

async function checkSettings() {
    try {
        const { rows } = await db.query('SELECT * FROM settings');
        console.log('--- SETTINGS TABLE ---');
        rows.forEach(r => console.log(`${r.key}: ${r.value}`));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSettings();
