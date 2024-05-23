import { Client } from 'pg';
import { PostgresConfig } from './drizzle.interfaces';
import { v4 as uuid } from 'uuid';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export function getModelToken(table: any, connection: string = 'default'): string {
  if (!table) {
    throw new Error('@InjectModel() parameter is undefined');
  }
  const connectionPrefix = getConnectionPrefix(connection);
  return `${connectionPrefix}${table.name}Repository`;
}

export function getConnectionToken(connection: string = 'default'): string {
  return connection === 'default' ? 'DefaultDrizzleConnection' : `${connection}Connection`;
}

export function getConnectionPrefix(connection: string = 'default'): string {
  return connection === 'default' ? '' : `${connection}_`;
}

export function createConnection(config: PostgresConfig, schema: any): PostgresJsDatabase {
  const connectionString = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
  const client = new Client({ connectionString });

  client.connect().catch(err => {
    throw new Error(`Failed to connect to the database: ${err.message}`);
  });

  return drizzle(client, { schema });
}

export const generateString = (): string => uuid();
