import { DrizzleConfig } from 'drizzle-orm';
import { ClientConfig, PoolConfig } from 'pg';
import { connectionEnum } from '../enums/connection.enum';

export interface IDrizzlePostgresConfig {
  postgres: {
    connection: connectionEnum.CLIENT | connectionEnum.POOL;
    config: ClientConfig | PoolConfig;
  };
  config?: DrizzleConfig<any> | undefined;
}
