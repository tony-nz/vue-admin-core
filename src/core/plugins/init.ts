import { App } from "vue";
import { initInlineSvg } from "./inline-svg";
import { initPrimeVue } from "./primevue";
import { initResources } from "./resources";
import { initErrorLog } from "./errorLog";
import ApiService from "../services/ApiService";
import i18n from "./i18n";
import Vue3Toasity, { type ToastContainerOptions } from "vue3-toastify";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue3-toastify/dist/index.css";
import "vue-loading-overlay/dist/css/index.css";
/**
 * Initialize plugins
 * @param app vue instance
 */
export const initPlugins = async function (app: App<Element>, router, options) {
  // Load CRUD Resources
  await initResources(app, router);

  // Load Api Service
  ApiService.init(app);

  // Load Error Log
  initErrorLog(app);

  // Apply locales
  app.use(i18n);

  // Load additional plugins
  initInlineSvg(app);

  // PrimeVue with preset
  if (options.primevue.preset) {
    initPrimeVue(app, options.primevue.preset);
  } else {
    initPrimeVue(app);
  }

  // toast
  app.use(Vue3Toasity, {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions);

  /**
   * Initialize Locales
   */
  if (options.config?.locales) {
    // loop through payload and set each locale
    for (const [key, value] of Object.entries(options.config.locales)) {
      i18n.global.setLocaleMessage(key, Object.assign({}, value));
    }
  }

  // loader
  app.use(LoadingPlugin);
};
