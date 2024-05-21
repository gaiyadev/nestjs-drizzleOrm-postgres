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
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
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
      useFactory: async (sequelizeOptions: DrizzleModuleOptions) => {
        if (options.name) {
          return await this.createConnectionFactory({
            ...sequelizeOptions,
            name: options.name,
          });
        }
        return await this.createConnectionFactory(sequelizeOptions);
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
  ): Promise<Sequelize> {
    return lastValueFrom(
      defer(async () => {
        const sequelize = options?.uri
          ? new Sequelize(options.uri, options)
          : new Sequelize(options);

        if (!options.autoLoadModels) {
          return sequelize;
        }

        const connectionToken = options.name || DEFAULT_CONNECTION_NAME;
        const models = EntitiesMetadataStorage.getEntitiesByConnection(
          connectionToken,
        );
        sequelize.addModels(models as Sequelize);

        await sequelize.authenticate();

        if (typeof options.synchronize === 'undefined' || options.synchronize) {
          await sequelize.sync(options.sync);
        }
        return sequelize;
      }).pipe(handleRetry(options.retryAttempts, options.retryDelay)),
    );
  }
}
