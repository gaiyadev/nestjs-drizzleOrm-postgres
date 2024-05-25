## Description

> [nestjs-drizzle-orm-postgres](https://github.com/gaiyadev/nestjs-drizzleOrm-postgres) is a postgres drizzle ORM module for NestJs framework (node.js).

## Installation

```bash
$ npm i nestjs-drizzle-orm-postgres
```

## Usage

```code
import { DrizzleModule } from 'nestjs-drizzle-postgres';
import { connectionEnum } from 'nestjs-drizzle-postgres/dist/enums/connection.enum';
import { schema } from './db/schema';

     DrizzleModule.forRoot({
      tag: 'DB_DEV',
      postgres: {
        connection: connectionEnum.CLIENT,
        config: {
          connectionString: `postgresql://${process.env['LOCAL_DATABASE_USER']}:${process.env['LOCAL_DATABASE_PASSWORD']}@localhost:5432/drizzle_orm`,
        },
      },
      config: { schema: { ...schema } },
    }),
    
    // or
    
    DrizzleModule.forRootAsync({
      tag: 'DB_DEV',
      postgres: {
        connection: connectionEnum.CLIENT,
        config: {
          connectionString: `postgresql://${process.env['LOCAL_DATABASE_USER']}:${process.env['LOCAL_DATABASE_PASSWORD']}@localhost:5432/drizzle_orm`,
        },
      },
      config: { schema: { ...schema } },
    }),
```

Now in the service

```code
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from './db/schema';

  constructor(@Inject('DB_DEV') private db: NodePgDatabase<typeof schema>) {}


async getHello(): Promise<any> {
    try {
      const users = await this.db.query.users.findMany({});
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Re-throw the error to propagate it up the call stack
    }
  }
```
## Support

This project is an MIT-licensed open source project.

## Stay in touch


## License

