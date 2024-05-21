import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export type DrizzleModuleOptions = {
  /**
   * Connection name
   */
  name?: string;
  /**
   * Number of times to retry connecting
   * Default: 10
   */
  retryAttempts?: number;
  /**
   * Delay between connection retry attempts (ms)
   * Default: 3000
   */
  retryDelay?: number;
  /**
   * If `true`, models will be loaded automatically.
   */
  autoLoadModels?: boolean;
  /**
   * If `true`, "sequelize.sync()" will be called.
   * Default: true
   */
  synchronize?: boolean;
  /**
   * Sequelize connection string
   */
  uri?: string;
} & Partial<any>; //to be drizzle option

export interface DrizzleOptionsFactory {
  createSequelizeOptions(
    connectionName?: string,
  ): Promise<DrizzleModuleOptions> | DrizzleModuleOptions;
}

export interface DrizzleModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<DrizzleOptionsFactory>;
  useClass?: Type<DrizzleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<DrizzleModuleOptions> | DrizzleModuleOptions;
  inject?: any[];
}
