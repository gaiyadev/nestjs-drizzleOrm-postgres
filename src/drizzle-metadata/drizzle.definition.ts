import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzlePostgresConfig } from '../interfaces/drizzle.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzlePostgresConfig>()
  .setExtras(
    {
      tag: 'default',
    },
    (definition, extras) => ({
      ...definition,
      tag: extras.tag,
    }),
  )
  .build();
