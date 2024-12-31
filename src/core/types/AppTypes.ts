import ResourceConfig from "./ResourceConfigTypes";

interface AppConfig {
  locale: string;
  resources?: ResourceConfig[];
}

export default AppConfig;

export type { AppConfig };
