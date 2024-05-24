import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DrizzleConfigOptions } from './drizzle.interface';
import { drizzle } from 'drizzle-orm/postgres-js';

@Injectable()
export class DrizzleService {
  public getDrizzle(options: DrizzleConfigOptions) {
    try {
      const client = postgres(options.postgres.url, options.postgres.config);
      return drizzle(client, options?.config);
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }
}
