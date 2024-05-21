import { Provider } from '@nestjs/common';
import { getConnectionToken, getModelToken } from './common/drizzle.utils';

export function createDrizzleProviders(
  entities?: Function[],
  connection?: any | string,
): Provider[] {
  const repositories = (entities || []).map(entity => ({
    provide: getModelToken(entity, connection),
    useFactory: (connection: any) => {
      if (!connection.repositoryMode) {
        return entity;
      }
      return connection.getRepository(entity as any);
    },
    inject: [getConnectionToken(connection)],
  }));

  return [...repositories];
}
