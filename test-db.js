import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        console.log('Testing connection to:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NONE');
        await client.connect();
        console.log('Successfully connected!');
        const res = await client.query('SELECT NOW()');
        console.log('Time from DB:', res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error('Connection failed!');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        process.exit(1);
    }
}

test();
