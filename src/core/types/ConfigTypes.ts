import LayoutConfigTypes from "./LayoutConfigTypes";
import UserMenu from "./UserMenuTypes";
import UserAppMenu from "./UserAppsMenuTypes";
import type MainMenu from "./MainMenuTypes";

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

interface OAuthConfig {
  provider: string;
  login: string;
  callback: string;
}

interface Config {
  api: APIConfig;
  initial: LayoutConfigTypes;
  layout: LayoutConfigTypes;
  locale: string;
  menu: {
    apps: UserAppMenu;
    user: UserMenu;
    main: MainMenu[];
  };
  oauth: OAuthConfig;
  resources: any;
}

export default Config;

export type { Config };
