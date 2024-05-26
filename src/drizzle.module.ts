import { Global, DynamicModule, Module } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './drizzle-metadata/drizzle.definition';
import { DrizzleProvider } from './drizzle.provider';
import { IDrizzleConfig } from './interfaces/drizzle.interface';

@Global()
@Module({})
export class DrizzleModule extends ConfigurableModuleClass {
  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...props } = super.register(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzleProvider,
        {
          provide: options?.tag || 'default',
          useFactory: async (drizzleService: DrizzleProvider) => {
            return await drizzleService.setDrizzle(options);
          },
          inject: [DrizzleProvider],
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
        DrizzleProvider,
        {
          provide: options?.tag || 'default',
          useFactory: async (
            drizzleService: DrizzleProvider,
            config: IDrizzleConfig,
          ) => {
            return await drizzleService.setDrizzle(config);
          },
          inject: [DrizzleProvider, MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
}
