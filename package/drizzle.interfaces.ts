export interface DrizzleModuleOptions {
  name?: string;
  config: PostgresConfig;
}

export interface PostgresConfig {
  connectionString: string;
  // Include other PostgreSQL specific configurations if needed
}
