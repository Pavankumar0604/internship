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

// Configuration
const config = {
    schemaPath: path.join(__dirname, '../supabase/schema.sql'),
    connectionString: process.env.DATABASE_URL
};

async function setupDatabase() {
    console.log('🚀 Starting Database Setup...');

    if (!config.connectionString) {
        console.error('❌ Error: DATABASE_URL not found in .env file.');
        process.exit(1);
    }

    if (!fs.existsSync(config.schemaPath)) {
        console.error(`❌ Error: Schema file not found at ${config.schemaPath}`);
        process.exit(1);
    }

    const client = new Client({
        connectionString: config.connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('📡 Connecting to Supabase...');
        await client.connect();
        console.log('✅ Connected to database');

        // Verify connection first
        const verifyRes = await client.query('SELECT NOW()');
        console.log(`⏱️ Server time: ${verifyRes.rows[0].now}`);

        console.log('📦 Reading schema file...');
        const schemaSql = fs.readFileSync(config.schemaPath, 'utf8');

        console.log('⚡ Executing schema script...');
        await client.query(schemaSql);

        console.log('✨ SUCCESS: Database schema successfully deployed!');
        console.log('   - Tables initialized');
        console.log('   - RLS Policies standardizing');
        console.log('   - Constraints & Triggers active');

        // Final verification
        const domainsRes = await client.query('SELECT count(*) FROM domains');
        console.log(`📊 Verified: ${domainsRes.rows[0].count} domains available.`);

    } catch (err) {
        console.error('❌ Database Setup Failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupDatabase();
