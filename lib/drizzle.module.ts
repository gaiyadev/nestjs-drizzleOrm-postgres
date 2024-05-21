import { DynamicModule, Module } from '@nestjs/common';
import { EntitiesMetadataStorage } from './entities-metadata.storage';
import {
    DrizzleModuleAsyncOptions, DrizzleModuleOptions
} from './interfaces/drizzle-options.interface';
import { DrizzleCoreModule } from './drizzle-core.module';
import { DEFAULT_CONNECTION_NAME } from './drizzle.constant';
import { createDrizzleProviders } from './drizzle.provider';

@Module({})
export class DrizzleModule {
  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    return {
      module: DrizzleModule,
      imports: [DrizzleCoreModule.forRoot(options)],
    };
  }

  static forFeature(
    entities: Function[] = [],
    connection: any | string = DEFAULT_CONNECTION_NAME,
  ): DynamicModule {
    const providers = createDrizzleProviders(entities, connection);
    EntitiesMetadataStorage.addEntitiesByConnection(connection, entities);
    return {
      module: DrizzleModule,
      providers: providers,
      exports: providers,
    };
  }

  static forRootAsync(options: DrizzleModuleAsyncOptions): DynamicModule {
    return {
      module: DrizzleModule,
      imports: [DrizzleCoreModule.forRootAsync(options)],
    };
  }
}
