import { AuthConfig } from "../types/AuthTypes";

const config: AuthConfig = {
  api: {
    csrfCookie: "/sanctum/csrf-cookie",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    register: "/api/auth/register",
    update: "/api/auth/update",
    verify: "/api/auth/verify",
    permissions: "/api/auth/ability",
  },
  oauth: {
    provider: "google",
    login: "/api/oauth/google",
    callback: "/api/oauth/google/callback",
  },
};

export default config;
