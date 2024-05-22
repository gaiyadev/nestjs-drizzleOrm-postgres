import { DynamicModule, Global, Module } from '@nestjs/common';
import { DrizzleModuleOptions } from './drizzle.interfaces';
import { DEFAULT_CONNECTION_NAME } from './drizzle.constants';
import { createConnection, getConnectionToken, getModelToken } from './drizzle.utils';

@Global()
@Module({})
export class DrizzleModule {
  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    const connectionProvider = {
      provide: getConnectionToken(options.name),
      useValue: createConnection(options.config),
    };

    return {
      module: DrizzleModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }

  static forFeature(entities: Function[], connection: string = DEFAULT_CONNECTION_NAME): DynamicModule {
    const providers = entities.map(entity => ({
      provide: getModelToken(entity, connection),
      useFactory: (connection) => connection.getRepository(entity), // Adjust this based on Drizzle API
      inject: [getConnectionToken(connection)],
    }));

    return {
      module: DrizzleModule,
      providers: providers,
      exports: providers,
    };
  }
}
