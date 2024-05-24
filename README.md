<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[nestjs-drizzleOrm-postgres](https://github.com/nestjs/nest) Postgres DrizzleORM module for Nest framework (node.js).

## Installation

```bash
$ npm i drizzle-orm postgres nestjs-drizzleorm-postgres
```
## Explanation

Sure, I'll explain each part of the code in detail to help you understand how it works.

1. index.ts
This file exports everything from the drizzle.module file, making it easier to import the module from other parts of your application.

```code
export * from './drizzle.module';

```

2. drizzle.definition.ts
This file uses the ConfigurableModuleBuilder from NestJS to create a configurable module. It defines the options and token for the Drizzle module.

```code
import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzleConfigOptions } from './drizzle.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzleConfigOptions>()
  .setExtras(
    {
      tag: 'default',
    },
    (definition, extras) => ({
      ...definition,
      tag: extras.tag,
    })
  )
  .build();

```

#### Key Points:
1. ConfigurableModuleBuilder: This utility helps in building dynamic modules that can accept configuration options.
2. DrizzleConfigOptions: The interface defining the configuration options for the Drizzle module.
3. Extras: Allows adding extra properties to the module definition, like a tag.

3.  drizzle.interface.ts
This file defines the configuration interface for the Drizzle module.

```code
import { DrizzleConfig } from 'drizzle-orm';
import { Options, PostgresType } from 'postgres';

export interface DrizzleConfigOptions {
  postgres: {
    url: string;
    config?: Options<Record<string, PostgresType<any>>> | undefined;
  };
  config?: DrizzleConfig<any> | undefined;
}

```

#### Key Points:
1. DrizzleConfigOptions: Interface for the configuration options.
2. postgres: Contains the connection URL and optional configuration for the Postgres client.
3. config: Optional configuration for Drizzle.

4. drizzle.module.ts
This file defines the DrizzleModule using the ConfigurableModuleClass created earlier. It provides two methods: forRoot and forFeature.

```code
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

```

#### Key Points:

1. forRoot: Registers the module with the provided configuration options.
2. forRootAsync: Registers the module asynchronously, useful for when the configuration options are provided dynamically.
3. forFeature: Registers specific tables (models) to the module, allowing access to specific repositories.

5. drizzle.service.ts
This file defines a service that initializes the Drizzle ORM with the given Postgres connection options.

```code
import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DrizzleConfigOptions } from './drizzle.interface';
import { drizzle } from 'drizzle-orm/postgres-js';

@Injectable()
export class DrizzleService {
  public getDrizzle(options: DrizzleConfigOptions) {
    const client = postgres(options.postgres.url, options.postgres.config);
    return drizzle(client, options?.config);
  }
}

```
#### Key Points:
getDrizzle: Method that initializes the Drizzle ORM using the provided Postgres connection URL and options.

### Usage Example in app.module.ts
This shows how to use the DrizzleModule in your application.

```code
import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';  // Assume this is the entity

@Module({
  imports: [
    DrizzleModule.forRoot({
      postgres: {
        url: 'postgres://username:password@localhost:5432/mydb',
        config: {
          /* Additional postgres options */
        },
      },
      config: {
        /* Drizzle config */
      },
    }),
    DrizzleModule.forFeature([User]),  // Register feature for User entity
    UserModule,
  ],
})
export class AppModule {}

```

### Key Points:
1. forRoot: Used to configure the DrizzleModule with the database connection options.
2. forFeature: Used to register specific entities (tables) with the module.

### Summary
1. index.ts: Simplifies importing the module.
2. drizzle.definition.ts: Creates the configurable module with necessary options.
3. drizzle.interface.ts: Defines the configuration interface.
4. drizzle.module.ts: Defines the module with forRoot, forRootAsync, and forFeature methods.
5. drizzle.service.ts: Initializes and provides the Drizzle ORM.

This setup follows NestJS best practices, making the module easy to configure and use across your application.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
