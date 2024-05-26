import { IDrizzleConfig } from './interfaces/drizzle.interface';
import { Injectable } from '@nestjs/common';
import { Client, Pool } from 'pg';
// import mysql from 'mysql2/promise';
import * as mysql from 'mysql2';

import { connectionEnum } from './enums/connection.enum';
import { DialectEnum } from './enums/dialect.enum';
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleMySql } from 'drizzle-orm/mysql2';
import { IDrizzleProvider } from './interfaces/drizzle-provider.interface';

@Injectable()
export class DrizzleProvider implements IDrizzleProvider {
  public async setDrizzle(options: IDrizzleConfig) {
    if (options.dialect === DialectEnum.POSTGRES) {
      if (options.postgres.connection === connectionEnum.CLIENT) {
        const client = new Client(options.postgres.config);
        await client.connect();
        return drizzlePostgres(client, options?.config);
      }
      const pool = new Pool(options.postgres.config);
      return drizzlePostgres(pool, options?.config);
    }

    if (options.dialect === DialectEnum.MYSQL) {
      if (options.mysql?.connection === connectionEnum.CLIENT) {
        const client = await mysql.createConnection(
          options.mysql.config as any,
        );
        return drizzleMySql(client, options.config);
      }
      const pool = await mysql.createPool(options.mysql.config as any);
      return drizzleMySql(pool, options.config);
    }
    throw new Error('Unsupported dialect');
  }
}
