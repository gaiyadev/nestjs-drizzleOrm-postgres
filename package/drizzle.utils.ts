import { Client } from 'pg';
import { DrizzleModuleOptions, PostgresConfig } from './drizzle.interfaces';
import { DEFAULT_CONNECTION_NAME } from './drizzle.constants';
import { v4 as uuid } from 'uuid';

export function getModelToken(
  entity: Function,
  connection: DrizzleModuleOptions | string = DEFAULT_CONNECTION_NAME,
): string {
  if (entity === null || entity === undefined) {
    throw new Error('@InjectModel() parameter is undefined');
  }
  const connectionPrefix = getConnectionPrefix(connection);
  return `${connectionPrefix}${entity.name}Repository`;
}

export function getConnectionToken(
  connection: DrizzleModuleOptions | string = DEFAULT_CONNECTION_NAME,
): string {
  return connection === DEFAULT_CONNECTION_NAME
    ? 'DefaultDrizzleConnection'
    : typeof connection === 'string'
    ? `${connection}Connection`
    : connection.name
    ? `${connection.name}Connection`
    : 'DefaultDrizzleConnection';
}

export function getConnectionPrefix(
  connection: DrizzleModuleOptions | string = DEFAULT_CONNECTION_NAME,
): string {
  if (connection === DEFAULT_CONNECTION_NAME) {
    return '';
  }
  if (typeof connection === 'string') {
    return `${connection}_`;
  }
  if (!connection.name || connection.name === DEFAULT_CONNECTION_NAME) {
    return '';
  }
  return `${connection.name}_`;
}

export function createConnection(config: PostgresConfig): any {
  const client = new Client({
    connectionString: config.connectionString,
  });

  client.connect();

  // Replace with actual Drizzle connection logic using the connected client
  return {
    getRepository: (entity: Function) => {
      // Replace with actual repository creation logic
      return {};
    },
  };
}

export const generateString = (): string => uuid();
