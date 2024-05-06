import { Config } from "../types/AppTypes";
import defaultLayoutConfig from "./DefaultLayoutConfig";

const config: Config = {
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
  initial: defaultLayoutConfig,
  layout: {},
  locale: window.localStorage.getItem("locale") || "en",
  menu: {
    apps: {},
    main: [],
    user: {},
  },
  oauth: {
    provider: "google",
    login: "/api/oauth/google",
    callback: "/api/oauth/google/callback",
  },
  resources: {},
};

export default config;
