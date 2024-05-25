import { IDrizzlePostgresConfig } from './interfaces/drizzle.interface';
import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';
import { connectionEnum } from './enums/connection.enum';
import { IDrizzleProvider } from './interfaces/drizzle-provider.interface';

@Injectable()
export class DrizzleProvider implements IDrizzleProvider {
  public async setDrizzle(options: IDrizzlePostgresConfig) {
    if (options.postgres.connection === connectionEnum.CLIENT) {
      const client = new Client(options.postgres.config);
      await client.connect();
      return drizzle(client, options?.config);
    }
    const pool = new Pool(options.postgres.config);
    return drizzle(pool, options?.config);
  }
}
