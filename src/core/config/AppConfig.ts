import AppConfig from "../types/AppTypes";

const config: AppConfig = {
  locale: window.localStorage.getItem("locale") || "en",
  resources: [],
};

export default config;
