import { Global, DynamicModule } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './drizzle-metadata/drizzle.definition';
import { DrizzlePostgresService } from './drizzle.service';
import { DrizzlePostgresConfig } from './interfaces/drizzle.interface';

@Global()
export class DrizzlePostgresModule extends ConfigurableModuleClass {
  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...props } = super.register(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzlePostgresService,
        {
          provide: options?.tag || 'default',
          useFactory: async (drizzleService: DrizzlePostgresService) => {
            return await drizzleService.getDrizzle(options);
          },
          inject: [DrizzlePostgresService],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const {
      providers = [],
      exports = [],
      ...props
    } = super.registerAsync(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzlePostgresService,
        {
          provide: options?.tag || 'default',
          useFactory: async (
            drizzleService: DrizzlePostgresService,
            config: DrizzlePostgresConfig,
          ) => {
            return await drizzleService.getDrizzle(config);
          },
          inject: [DrizzlePostgresService, MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
}
