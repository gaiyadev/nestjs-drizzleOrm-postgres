import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IDrizzleConfig } from '../interfaces/drizzle.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<IDrizzleConfig>()
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
