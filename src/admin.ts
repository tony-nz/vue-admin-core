import { initPlugins } from "./core/plugins/init";
import { initRouter } from "./router";
import useAuthStore from "./store/auth";
import useConfigStore from "./store/config";
import useLocalesStore from "./store/locales";

export default class VueAdmin {
  constructor({ app, options }) {
    const router = options.router;
    const authStore = useAuthStore();
    const configStore = useConfigStore();
    const localesStore = useLocalesStore();


    /**
     * Initialize Config
     */
    if (options?.config) {
      configStore.setConfig(options.config);

      /**
       * Initialize AuthConfig
       */
      if (options.config.auth) {
        authStore.setAuthConfig(options.config.auth);
      }
    }

    /**
     * Initialize Locales
     */
    if (options.config?.locales) {
      localesStore.setLocales(options.config.locales);
    }

    // const messages = Object.assign({}, useConfigStore().config.locales);
    /**
     * Initialize plugins
     * @param app vue instance
     */
    initPlugins(app, router);

    /**
     * Initialize router defaults
     * @param router vue router
     */
    initRouter(router);
  }
}
