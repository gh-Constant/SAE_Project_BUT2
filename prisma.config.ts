import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: path.join(__dirname, 'backend', '.env') });

export default defineConfig({
  schema: path.join(__dirname, 'backend/prisma'),
})