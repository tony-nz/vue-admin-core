interface API {
  baseURL: string;
  csrfCookie: string;
  login: string;
  logout: string;
  register: string;
  update: string;
  verify: string;
  permissions: string;
}

interface OAuth {
  provider: string;
  login: string;
  callback: string;
}

interface AuthConfig {
  api: API;
  oauth: OAuth;
}

export default AuthConfig;

export type { API, OAuth, AuthConfig };
