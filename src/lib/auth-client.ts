"use client";

import { inferAdditionalFields, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./auth";

const baseURL = process.env.NEXT_PUBLIC_APP_URL;

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
});
