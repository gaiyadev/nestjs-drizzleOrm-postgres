import { DrizzleConfig } from 'drizzle-orm';
import { ClientConfig, PoolConfig } from 'pg';
import { connectionEnum } from '../enums/connection.enum';

export interface DrizzlePostgresConfig {
  postgres: {
    connection: connectionEnum.client | connectionEnum.pool;
    config: ClientConfig | PoolConfig;
  };
  config?: DrizzleConfig<any> | undefined;
}
