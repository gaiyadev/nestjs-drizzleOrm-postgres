import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { defer, lastValueFrom } from 'rxjs';
import {
  generateString,
  getConnectionToken,
  handleRetry,
} from './common/drizzle.utils';
import { EntitiesMetadataStorage } from './entities-metadata.storage';
import {
  DrizzleModuleAsyncOptions, DrizzleModuleOptions, DrizzleOptionsFactory
} from './interfaces/drizzle-options.interface';
import {
    DRIZZLE_MODULE_ID, DRIZZLE_MODULE_OPTIONS,
  DEFAULT_CONNECTION_NAME,
} from './drizzle.constant';
import { drizzle } from 'drizzle-orm/postgres-js';


@Global()
@Module({})
export class DrizzleCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(DRIZZLE_MODULE_OPTIONS)
    private readonly options: DrizzleModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: DrizzleModuleOptions = {}): DynamicModule {
    const drizzleModuleOptions = {
      provide: DRIZZLE_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider = {
      provide: getConnectionToken(options as any) as string,
      useFactory: async () => await this.createConnectionFactory(options),
    };

    return {
      module: DrizzleCoreModule,
      providers: [connectionProvider, drizzleModuleOptions],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(options: DrizzleModuleAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: getConnectionToken(options as DrizzleModuleOptions) as string,
      useFactory: async (drizzleOptions: DrizzleModuleOptions) => {
        if (options.name) {
          return await this.createConnectionFactory({
            ...drizzleOptions,
            name: options.name,
          });
        }
        return await this.createConnectionFactory(drizzleOptions);
      },
      inject: [DRIZZLE_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: DrizzleCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        {
          provide: DRIZZLE_MODULE_ID,
          useValue: generateString(),
        },
      ],
      exports: [connectionProvider],
    };
  }

  async onApplicationShutdown() {
    const connection = this.moduleRef.get<any>(
      getConnectionToken(this.options as any) as Type<any>,
    );
    connection && (await connection.close());
  }

  private static createAsyncProviders(
    options: DrizzleModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<DrizzleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: DrizzleModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: DRIZZLE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<DrizzleOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<DrizzleOptionsFactory>,
    ];
    return {
      provide: DRIZZLE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: DrizzleOptionsFactory) =>
        await optionsFactory.createSequelizeOptions(options.name),
      inject,
    };
  }

  private static async createConnectionFactory(
    options: DrizzleModuleOptions,
  ): Promise<unknown> {
    return lastValueFrom(
      defer(async () => {
        const drizzle1 = options?.uri
          ? drizzle(options.uri)
          :  drizzle(options);

        if (!options.autoLoadModels) {
          return drizzle1;
        }

        const connectionToken = options.name || DEFAULT_CONNECTION_NAME;
        const models = EntitiesMetadataStorage.getEntitiesByConnection(
          connectionToken,
        );
        drizzle1.with(models as any);

        await drizzle1;

        if (typeof options.synchronize === 'undefined' || options.synchronize) {
          await drizzle1.with(options.sync);
        }
        return drizzle1;
      }).pipe(handleRetry(options.retryAttempts, options.retryDelay)),
    );
  }
}
