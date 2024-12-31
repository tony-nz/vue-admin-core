import { AuthConfig } from "../types/AuthTypes";

const config: AuthConfig = {
  api: {
    baseURL: "http://localhost:8000",
    csrfCookie: "/sanctum/csrf-cookie",
    login: "/login",
    logout: "/logout",
    register: "/register",
    update: "/api/auth/update",
    verify: "/api/auth/verify",
    permissions: "/api/auth/ability",
    settings: "/api/settings",
  },
  oauth: {
    provider: "google",
    login: "/api/oauth/google",
    callback: "/api/oauth/google/callback",
  },
};

export default config;
