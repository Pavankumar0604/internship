import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

// Read schema file
const schemaPath = path.join(__dirname, '../supabase/schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

console.log('📦 Preparing to push schema to Supabase...');

// Get DB URL from env
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ Error: DATABASE_URL not found in .env file.');
    console.log('Please ensure you have added DATABASE_URL=postgresql://... to your .env file');
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function pushSchema() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        console.log('🚀 Executing schema script...');
        // Execute the entire SQL script
        await client.query(schemaSql);

        console.log('✅ Schema successfully deployed to Supabase!');
        console.log('   - Tables created/updated');
        console.log('   - Policies applied');
        console.log('   - Functions & Triggers set');

    } catch (err) {
        console.error('❌ Failed to push schema:', err.message);
        if (err.position) {
            console.error('   at character position:', err.position);
        }
    } finally {
        await client.end();
    }
}

pushSchema();
