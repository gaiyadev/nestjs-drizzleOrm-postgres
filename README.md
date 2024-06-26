## Description

> [nestjs-drizzle-orm](https://github.com/gaiyadev/nestjs-drizzleOrm-postgres) Is a NestJS ORM module tailored for Drizzle, supporting PostgreSQL and MySQL dialects. Simplify your database interactions effortlessly.

## Installation

```bash
$ npm i nestjs-drizzle-orm
```

## Module Usage

### Postgres Configuration

Method #1: Pass options object

```code
import { DrizzleModule } from 'nestjs-drizzle-orm';
import { DialectEnum } from 'nestjs-drizzle-orm/dist/enums/dist/enums/dialect.enum';
import { connectionEnum } from 'nestjs-drizzle-orm/dist/enums/connection.enum';
import { schema } from './db/schema';

     DrizzleModule.forRoot({
      tag: 'DB_DEV',
      dialect: DialectEnum.POSTGRES,
      postgres: {
        connection: connectionEnum.CLIENT,
        config: {
          connectionString: `postgresql://${process.env['LOCAL_DATABASE_USER']}:${process.env['LOCAL_DATABASE_PASSWORD']}@localhost:5432/drizzle_orm`,
        },
      },
      config: { schema: { ...schema } },
    }),
```

Method #2: useFactory()

```code    
 DrizzleModule.forRootAsync({
      tag: 'DB_DEV',
      useFactory() {
        return {
          dialect: DialectEnum.POSTGRES,
          postgres: {
            connection: connectionEnum.CLIENT,
            config: {
              connectionString: `postgresql://${process.env['LOCAL_DATABASE_USER']}:${process.env['LOCAL_DATABASE_PASSWORD']}@localhost:5432/drizzle_orm`,
            },
          },
          config: { schema: { ...schema } },
        };
      },
    }),
```

Method #3: useClass()

```code
 DrizzleModule.forRootAsync({
      tag: 'DB_DEV',
      dialect: DialectEnum.POSTGRES,
      useClass: DBConfigService,
 }),
    
export class DBConfigService {
  create = () => {
    return {
      postgres: {
      connection: connectionEnum.CLIENT,
      config: {
          connectionString: 'postgres://postgres:@127.0.0.1:5432/drizzleDB',
        },
      },
      config: { schema: { ...schema } },
    };
  };
}
```


### MYSQL Configuration

Method #1: Pass options object

```code
DrizzleModule.forRoot({
      tag: 'DB_DEV',
      dialect: DialectEnum.MYSQL,
      mysql: {
        connection: connectionEnum.CLIENT,
        config: {
          password: '',
          user: 'root',
          host: '127.0.0.1',
          database: 'drizzle_orm',
        },
      },
      config: { schema: { ...schema }, mode: 'default' },
    }),
```

Method #2: useFactory()

```code
 DrizzleModule.forRootAsync({
      tag: 'DB_DEV',
      useFactory() {
        return {
          tag: 'DB_DEV',
          dialect: DialectEnum.MYSQL,
          mysql: {
            connection: connectionEnum.CLIENT,
            config: {
              password: '',
              user: 'root',
              host: '127.0.0.1',
              database: 'drizzle_orm',
            },
          },
          config: { schema: { ...schema }, mode: 'default' },
        };
      },
    }),
```

Method #3: useClass()

```code
 DrizzleModule.forRootAsync({
      tag: 'DB_DEV',
      dialect: DialectEnum.MYSQL,
      useClass: DBConfigService,
 }),
    
export class DBConfigService {
  create = () => {
    return {
      postgres: {
      connection: connectionEnum.CLIENT,
      config: {
          password: '',
          user: 'root',
          host: '127.0.0.1',
         database: 'drizzle_orm',
        },
      },
      config: { schema: { ...schema } },
    };
  };
}
```

## Service implementation

### Postgres
Step #1: Service 
```code
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from './db/schema';

  constructor(@Inject('DB_DEV') private db: NodePgDatabase<typeof schema>) {}


async getHello(): Promise<any> {
    try {
      const users = await this.db.query.users.findMany();
      return users;
    } catch (error) {
      throw error; // Re-throw the error to propagate it up the call stack
    }
  }
```
Step #2: Schema

```code
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
});

// Create a schema object to bundle all tables
export const schema = {
  users,
};

```

### MYSQL

Step #1: Service

```code
import { MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from './db/schema';

constructor(@Inject('DB_DEV') private db: MySql2Database<typeof schema>) {}


async getHello(): Promise<any> {
    try {
      const users = await this.db.query.users.findMany();
      return users;
    } catch (error) {
      throw error; // Re-throw the error to propagate it up the call stack
    }
  }
```

Step #2: Schema

```code
import { mysqlTable, serial, text, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
});

// Create a schema object to bundle all tables
export const schema = {
  users,
};

```

## Support

## Stay in touch


## License

This project is an MIT-licensed open source project.

