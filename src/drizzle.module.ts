import { DynamicModule, Global, Module } from '@nestjs/common';
import { DrizzleModuleOptions } from './drizzle.interfaces';
import { DEFAULT_CONNECTION_NAME } from './drizzle.constants';
import { createConnection, getModelToken, getConnectionToken } from './drizzle.utils';

@Global()
@Module({})
export class DrizzleModule {
  static forRoot(options: DrizzleModuleOptions, schema: any): DynamicModule {
    const connectionProvider = {
      provide: getConnectionToken(options.name),
      useValue: createConnection(options.config, schema),
    };

    return {
      module: DrizzleModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }

  static forFeature(tables: any[], connection: string = DEFAULT_CONNECTION_NAME): DynamicModule {
    const providers = tables.map(table => ({
      provide: getModelToken(table, connection),
      useFactory: (db: any) => db.getRepository(table),
      inject: [getConnectionToken(connection)],
    }));

    return {
      module: DrizzleModule,
      providers: providers,
      exports: providers,
    };
  }
}
