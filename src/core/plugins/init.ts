import { App } from "vue";
import { initInlineSvg } from "./inline-svg";
import { initPrimeVue } from "./primevue";
import { initResources } from "./resources";
import { initErrorLog } from "./errorLog";
import ApiService from "../services/ApiService";
import i18n from "./i18n";

/**
 * Initialize plugins
 * @param app vue instance
 */
export const initPlugins = async function (app: App<Element>, router) {
  // Load CRUD Resources
  await initResources(app, router);
  // Load Api Service
  ApiService.init(app);
  // // Load Error Log
  initErrorLog(app);
  // // Apply locales
  app.use(i18n);
  // // Load additional plugins
  initInlineSvg(app);
  initPrimeVue(app);
};
