const { db } = require('./server/_src/config/db');
db.query('SELECT * FROM submissions').then(r => console.log(r.rows)).catch(console.error).finally(()=>process.exit(0));
