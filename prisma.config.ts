import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: path.join(__dirname, 'backend', '.env') });

export default defineConfig({
  schema: path.join(__dirname, 'backend/prisma'),
  // @ts-expect-error - datasource is supported in Prisma 6.16+ but types may not be fully updated
  datasource: {
    url: process.env.DATABASE_URL!,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
})
