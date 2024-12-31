import { App } from "vue";
import { initInlineSvg } from "./inline-svg";
import { initPrimeVue } from "./primevue";
import { initResources } from "./resources";
import { initErrorLog } from "./errorLog";
import { ObjectDirective } from "vue";
import ApiService from "../services/ApiService";
import i18n from "./i18n";
import useAuthStore from "../../store/auth";
import Vue3Toasity, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
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
    for (const [key, value] of Object.entries(options.config?.locales)) {
      i18n.global.setLocaleMessage(key, Object.assign({}, value));
    }
  }

  /**
   * Register permission directive
   */
  const permissionDirective: ObjectDirective = {
    mounted: (el, binding) => {
      const store = useAuthStore();
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

  if (options.config?.resources) {
    // Load CRUD Resources
    await initResources(router, options.config.resources);
  }

  // Load Api Service
  ApiService.init(app);

  // Load Error Log
  initErrorLog(app);

  // Vue3 Inline SVG
  initInlineSvg(app);

  // PrimeVue
  initPrimeVue(app);

  // Vue3Toasity
  app.use(Vue3Toasity, {
    autoClose: 3000,
  } as ToastContainerOptions);
};
