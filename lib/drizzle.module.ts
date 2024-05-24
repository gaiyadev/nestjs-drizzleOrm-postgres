import { Global, DynamicModule, Module } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './drizzle.definition';
import { DrizzleService } from './drizzle.service';
import { DrizzleConfigOptions } from './drizzle.interface';

@Global()
@Module({})
export class DrizzleModule extends ConfigurableModuleClass {
  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...props } = super.register(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzleService,
        {
          provide: options?.tag || 'default',
          useFactory: async (drizzleService: DrizzleService) => {
            return await drizzleService.getDrizzle(options);
          },
          inject: [DrizzleService],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...props } = super.registerAsync(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzleService,
        {
          provide: options?.tag || 'default',
          useFactory: async (
            drizzleService: DrizzleService,
            config: DrizzleConfigOptions
          ) => {
            return await drizzleService.getDrizzle(config);
          },
          inject: [DrizzleService, MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }

  static forFeature(tables: any[], connection: string = 'default'): DynamicModule {
    const providers = tables.map(table => ({
      provide: `${connection}_${table.name}Repository`,
      useFactory: (db) => db.getRepository(table),
      inject: [connection],
    }));

    return {
      module: DrizzleModule,
      providers,
      exports: providers,
    };
  }
}
