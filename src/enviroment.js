/**
 * @file enviroment.js
 * This file defines and validates environment variables using Zod.
 * If an error is thrown, it may be due to an empty or missing environment variable.
 * Please ensure all required environment variables are set.
 */

import z from "zod";

const requiredEnv = z.string().min(1);

/**
 * Schema definition for required environment variables.
 * Ensures that all required variables are non-empty strings.
 */
const envSchema = z.object({
  DATABASE_URL: requiredEnv,

  UPLOADTHING_SECRET: requiredEnv,

  NEXT_PUBLIC_UPLOADTHING_APP_ID: requiredEnv,
});

/**
 * Parses and validates the process environment variables
 * against the defined schema.
 *
 * @throws Will throw an error if any required environment variable is missing or empty.
 */
export const envParsed = envSchema.parse(process.env);
