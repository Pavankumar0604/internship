import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

// Clean up .env file
try {
    let content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let dbUrlAdded = false;

    // Use the correctly encoded URL
    const correctDbUrl = 'DATABASE_URL=postgresql://postgres:Mindmesh%40123@db.twzdoepsakfhfcigl.supabase.co:5432/postgres';

    for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
            continue; // Skip existing (bad) DB URLs
        }
        if (line.trim() !== '') {
            newLines.push(line.trim());
        }
    }

    // Add the correct URL
    newLines.push(correctDbUrl);

    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log('✅ .env fixed successfully');
} catch (err) {
    console.error('❌ Failed to fix .env:', err);
}
