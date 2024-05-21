import { Inject } from '@nestjs/common';
import { DrizzleModuleOptions } from '../interfaces/drizzle-options.interface';
import { DEFAULT_CONNECTION_NAME } from '../drizzle.constant';
import { getConnectionToken, getModelToken } from './drizzle.utils';

export const InjectModel = (
  entity: Function,
  connection: string = DEFAULT_CONNECTION_NAME,
) => Inject(getModelToken(entity, connection));

export const InjectConnection: (
  connection?: DrizzleModuleOptions | string,
) => ParameterDecorator = (connection?: DrizzleModuleOptions | string) =>
  Inject(getConnectionToken(connection));
