import { DrizzlePostgresConfig } from './interfaces/drizzle.interface';
import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';

@Injectable()
export class DrizzlePostgresService {
  public async getDrizzle(options: DrizzlePostgresConfig) {
    if (options.postgres.connection === 'client') {
      const client = new Client(options.postgres.config);
      await client.connect();
      return drizzle(client, options?.config);
    }
    const pool = new Pool(options.postgres.config);
    return drizzle(pool, options?.config);
  }
}
