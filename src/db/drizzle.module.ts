import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

export const DRIZZLE = Symbol('drizzle');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sql = neon(config.get('DATABASE_URL')!);
        return drizzle(sql, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
