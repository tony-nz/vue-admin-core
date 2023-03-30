import { initPlugins } from "./core/plugins/init";
import { initRouter } from "./router";
import useAuthStore from "./store/auth";
import useConfigStore from "./store/config";

export default class VueAdmin {
  constructor({ app, options }) {
    const router = options.router;
    const authStore = useAuthStore();
    const configStore = useConfigStore();

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

    // const messages = Object.assign({}, useConfigStore().config.locales);
    /**
     * Initialize plugins
     * @param app vue instance
     */
    initPlugins(app, router, options);

    /**
     * Initialize router defaults
     * @param router vue router
     */
    initRouter(router);
  }
}
