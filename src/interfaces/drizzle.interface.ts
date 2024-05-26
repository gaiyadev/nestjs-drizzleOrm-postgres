import { MySql2DrizzleConfig } from 'drizzle-orm/mysql2';
import { ConnectionOptions, PoolOptions } from 'mysql2';
import { ClientConfig, PoolConfig } from 'pg';
import { connectionEnum } from '../enums/connection.enum';
import { DialectEnum } from '../enums/dialect.enum';
import { DrizzleConfig } from 'drizzle-orm';

export interface IDrizzlePostgresConfig {
  connection: connectionEnum.CLIENT | connectionEnum.POOL;
  config: ClientConfig | PoolConfig;
}

export interface IDrizzleMySqlConfig {
  connection: connectionEnum.CLIENT | connectionEnum.POOL;
  config: ConnectionOptions | PoolOptions | string;
}

export interface IDrizzleConfig {
  dialect: DialectEnum;
  postgres?: IDrizzlePostgresConfig;
  mysql?: IDrizzleMySqlConfig;
  config?: DrizzleConfig<any> | MySql2DrizzleConfig<any>;
}
