import { App } from "vue";
import { initInlineSvg } from "./inline-svg";
import { initPrimeVue } from "./primevue";
import { initResources } from "./resources";
import { initErrorLog } from "./errorLog";
import { LoadingPlugin } from "vue-loading-overlay";
import { ObjectDirective } from "vue";
import ApiService from "../services/ApiService";
import i18n from "./i18n";
import useAppStore from "../../store/app";
import Vue3Toasity, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "vue-loading-overlay/dist/css/index.css";
/**
 * Initialize plugins
 * @param app vue instance
 */
export const initPlugins = async function (app: App<Element>, router, options) {
  // Apply locales
  app.use(i18n);

  /**
   * Initialize Locales
   */
  if (options.config?.locales) {
    // loop through payload and set each locale
    for (const [key, value] of Object.entries(options.config.locales)) {
      i18n.global.setLocaleMessage(key, Object.assign({}, value));
    }
  }

  /**
   * Register permission directive
   */
  const permissionDirective: ObjectDirective = {
    mounted: (el, binding) => {
      const store = useAppStore();
      const permission = binding.value;
      const userPermissions = store.getPermissions;
      if (permission && userPermissions) {
        const hasPermission = userPermissions.includes(permission);
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    },
  };

  /**
   * Apply permission directive
   */
  app.directive("permission", permissionDirective);

  // // Load CRUD Resources
  await initResources(router);

  // Load Api Service
  ApiService.init(app);

  // Load Error Log
  initErrorLog(app);

  // Load additional plugins
  initInlineSvg(app);

  // PrimeVuet\
  initPrimeVue(app);

  // toast
  app.use(Vue3Toasity, {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions);

  // loader
  app.use(LoadingPlugin);
};
