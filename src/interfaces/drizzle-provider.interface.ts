import { IDrizzleConfig } from './drizzle.interface';
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleMySql } from 'drizzle-orm/mysql2';

export interface IDrizzleProvider {
  setDrizzle(
    options: IDrizzleConfig,
  ): Promise<
    ReturnType<typeof drizzlePostgres> | ReturnType<typeof drizzleMySql>
  >;
}
