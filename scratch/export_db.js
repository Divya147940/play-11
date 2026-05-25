/**
 * play-11 Database Export Script
 * Exports entire Neon PostgreSQL DB to a single .sql file
 * Run: node scratch/export_db.js
 */

require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  ssl: { rejectUnauthorized: false }
});

const OUTPUT_FILE = path.join(__dirname, `play11_db_export_${new Date().toISOString().slice(0,10)}.sql`);

async function exportDB() {
  const client = await pool.connect();
  let sql = '';

  console.log('🔌 Connected to Neon PostgreSQL...');
  console.log(`📁 Output file: ${OUTPUT_FILE}\n`);

  try {
    // Header comment
    sql += `-- =====================================================\n`;
    sql += `-- Play-11 Database Export\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Host: Neon PostgreSQL (ap-southeast-1)\n`;
    sql += `-- Database: neondb\n`;
    sql += `-- =====================================================\n\n`;
    sql += `SET client_encoding = 'UTF8';\n`;
    sql += `SET standard_conforming_strings = on;\n\n`;

    // Step 1: Get all tables
    const { rows: tables } = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log(`📋 Found ${tables.length} tables: ${tables.map(t => t.tablename).join(', ')}\n`);

    for (const { tablename } of tables) {
      console.log(`⚙️  Exporting table: ${tablename}`);

      // Step 2: Get columns
      const { rows: cols } = await client.query(`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [tablename]);

      // Step 3: Get constraints
      const { rows: constraints } = await client.query(`
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name  AS foreign_table,
          ccu.column_name AS foreign_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.referential_constraints rc
          ON tc.constraint_name = rc.constraint_name
        LEFT JOIN information_schema.constraint_column_usage ccu
          ON rc.unique_constraint_name = ccu.constraint_name
        WHERE tc.table_schema = 'public' AND tc.table_name = $1
      `, [tablename]);

      // Build CREATE TABLE SQL
      sql += `-- ---------------------------------------------------\n`;
      sql += `-- Table: ${tablename}\n`;
      sql += `-- ---------------------------------------------------\n`;
      sql += `DROP TABLE IF EXISTS "${tablename}" CASCADE;\n`;
      sql += `CREATE TABLE "${tablename}" (\n`;

      const colDefs = cols.map(col => {
        let def = `  "${col.column_name}" `;

        if (col.data_type === 'character varying') {
          def += col.character_maximum_length ? `VARCHAR(${col.character_maximum_length})` : `TEXT`;
        } else if (col.data_type === 'integer') {
          def += 'INTEGER';
        } else if (col.data_type === 'bigint') {
          def += 'BIGINT';
        } else if (col.data_type === 'boolean') {
          def += 'BOOLEAN';
        } else if (col.data_type === 'timestamp without time zone') {
          def += 'TIMESTAMP';
        } else if (col.data_type === 'timestamp with time zone') {
          def += 'TIMESTAMPTZ';
        } else if (col.data_type === 'text') {
          def += 'TEXT';
        } else if (col.data_type === 'numeric') {
          def += 'NUMERIC';
        } else if (col.data_type === 'jsonb') {
          def += 'JSONB';
        } else if (col.data_type === 'json') {
          def += 'JSON';
        } else if (col.data_type === 'uuid') {
          def += 'UUID';
        } else {
          def += col.data_type.toUpperCase();
        }

        if (col.column_default) {
          def += ` DEFAULT ${col.column_default}`;
        }

        if (col.is_nullable === 'NO') {
          def += ' NOT NULL';
        }

        return def;
      });

      // Primary Key
      const pkCols = constraints
        .filter(c => c.constraint_type === 'PRIMARY KEY')
        .map(c => `"${c.column_name}"`);
      if (pkCols.length > 0) {
        colDefs.push(`  PRIMARY KEY (${pkCols.join(', ')})`);
      }

      sql += colDefs.join(',\n') + '\n';
      sql += `);\n\n`;

      // UNIQUE constraints
      const uniqueConstraints = constraints.filter(c => c.constraint_type === 'UNIQUE');
      for (const uc of uniqueConstraints) {
        sql += `ALTER TABLE "${tablename}" ADD CONSTRAINT "${uc.constraint_name}" UNIQUE ("${uc.column_name}");\n`;
      }
      if (uniqueConstraints.length > 0) sql += '\n';

      // Step 4: Export data
      const { rows: dataRows, rowCount } = await client.query(`SELECT * FROM "${tablename}"`);
      console.log(`   → ${rowCount} rows`);

      if (rowCount > 0) {
        sql += `-- Data for table: ${tablename} (${rowCount} rows)\n`;
        for (const row of dataRows) {
          const keys = Object.keys(row).map(k => `"${k}"`).join(', ');
          const vals = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
            if (typeof v === 'number') return v;
            if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
            return `'${String(v).replace(/'/g, "''")}'`;
          }).join(', ');
          sql += `INSERT INTO "${tablename}" (${keys}) VALUES (${vals});\n`;
        }
        sql += '\n';
      }
    }

    // Step 5: Foreign Key constraints (at the end to avoid order issues)
    sql += `-- ---------------------------------------------------\n`;
    sql += `-- Foreign Key Constraints\n`;
    sql += `-- ---------------------------------------------------\n`;

    const { rows: fkeys } = await client.query(`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    `);

    for (const fk of fkeys) {
      sql += `ALTER TABLE "${fk.table_name}" ADD CONSTRAINT "${fk.constraint_name}" `;
      sql += `FOREIGN KEY ("${fk.column_name}") REFERENCES "${fk.foreign_table_name}" ("${fk.foreign_column_name}");\n`;
    }

    sql += `\n-- =====================================================\n`;
    sql += `-- Export complete ✓\n`;
    sql += `-- =====================================================\n`;

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, sql, 'utf8');

    console.log(`\n✅ Export complete!`);
    console.log(`📄 File: ${OUTPUT_FILE}`);
    console.log(`📦 Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);

  } catch (err) {
    console.error('❌ Export failed:', err.message);
  } finally {
    client.release();
    await pool.end();
    process.exit();
  }
}

exportDB();
