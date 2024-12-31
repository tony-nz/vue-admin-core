interface APIConfig {
  baseURL: string;
  csrfCookie: string;
  login: string;
  logout: string;
  register: string;
  update: string;
  verify: string;
  permissions: string;
  settings: string;
}

interface OAppConfig {
  provider: string;
  login: string;
  callback: string;
}

interface AuthConfig {
  api: APIConfig;
  oauth: OAppConfig;
}

export default AuthConfig;

export type { APIConfig, AuthConfig, OAppConfig };
