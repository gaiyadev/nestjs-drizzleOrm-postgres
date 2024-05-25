import { IDrizzlePostgresConfig } from './drizzle.interface';
import { drizzle } from 'drizzle-orm/node-postgres';

export interface IDrizzleProvider {
  setDrizzle(
    options: IDrizzlePostgresConfig,
  ): Promise<ReturnType<typeof drizzle>>;
}
