import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verify() {
    try {
        await client.connect();
        const res = await client.query("SELECT count(*) FROM domains");
        console.log(`✅ VERIFICATION SUCCESS: Found ${res.rows[0].count} domains in database.`);
    } catch (err) {
        console.error('❌ VERIFICATION FAILED:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}
verify();
