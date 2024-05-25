import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzlePostgresConfig } from '../interfaces/drizzle.interface';
import { TagEnum } from '../enums/tag.enum';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzlePostgresConfig>()
  .setExtras(
    {
      tag: TagEnum.default,
    },
    (definition, extras) => ({
      ...definition,
      tag: extras.tag,
    }),
  )
  .build();
