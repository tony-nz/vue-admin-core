import { API } from "./ApiTypes";
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

interface OAppConfig {
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
  oauth: OAppConfig;
  resources: any;
}

interface Notification {
  api: any;
  error: any;
  warning: any;
  success: any;
  echo: any;
}

interface Breadcrumb {
  title: string;
  pageBreadcrumbPath: Array<string>;
  page: string;
}

interface App {
  api: API;
  appVersion: string;
  breadcrumbs: Breadcrumb;
  config: Config;
  errors: string[];
  isAuthenticated: boolean;
  locale: string;
  permissions: any;
  notifications: Notification;
  roles: any;
  settings: any;
  user: any;
}

export default App;

export type { App, Breadcrumb, Config, Notification };
