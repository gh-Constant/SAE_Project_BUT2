import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { getDatabaseConfig } from './backend/dist/config/database.js';

console.log(' Testing database configuration...');
console.log('');

// Test the configuration
const config = getDatabaseConfig();
console.log(' Database configuration:');
console.log(`   Host: ${config.host}`);
console.log(`   Port: ${config.port}`);
console.log(`   Username: ${config.username}`);
console.log(`   Password: ${config.password ? '***HIDDEN***' : 'undefined'}`);
console.log(`   Database: ${config.database}`);
console.log('');

// Test path resolution for SQL file
import fs from 'fs';

const possiblePaths = [
  path.resolve(process.cwd(), 'database/database.sql'),
  path.resolve(process.cwd(), 'backend/database/database.sql')
];

console.log(' Testing SQL file path resolution...');
for (const filePath of possiblePaths) {
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${filePath}`);
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`      Size: ${stats.size} bytes`);
  }
}

console.log('');
console.log('✅ Database configuration test completed!');