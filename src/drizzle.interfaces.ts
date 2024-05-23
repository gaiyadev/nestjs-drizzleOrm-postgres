export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface DrizzleModuleOptions {
  name?: string;
  config: PostgresConfig;
}
