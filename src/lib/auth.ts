import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies, toNextJsHandler } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { z } from "zod";

import { db } from "../db";

const employeeIdSchema = z
  .string()
  .trim()
  .min(4, "Employee ID must be at least 4 characters.")
  .max(24, "Employee ID must be 24 characters or fewer.")
  .regex(
    /^[A-Za-z0-9-]+$/,
    "Employee ID can only contain letters, numbers, and hyphens.",
  );

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      employeeId: {
        type: "string",
        required: true,
        unique: true,
        sortable: true,
        validator: {
          input: employeeIdSchema,
        },
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "employee",
        input: false,
        sortable: true,
      },
    },
  },
  plugins: [
    username({
      minUsernameLength: 4,
      maxUsernameLength: 24,
      usernameValidator: (value) => employeeIdSchema.safeParse(value).success,
    }),
    nextCookies(),
  ],
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "prodact-dev-secret-please-replace-before-real-deployment",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});

export const { GET, POST } = toNextJsHandler(auth);

export type AuthSession = typeof auth.$Infer.Session;
