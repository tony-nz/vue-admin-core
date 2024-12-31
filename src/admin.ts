import { initPlugins } from "./core/plugins/init";
import { initRouter } from "./router";
import useAppStore from "./store/app";
import { useAuthStore, useLayoutStore } from "./utils";

export default class VueAdmin {
  constructor({ app, options }) {
    const router = options.router;
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const layoutStore = useLayoutStore();

    /**
     * Initialize Config
     */
    if (options?.config) {
      if (options.config?.auth) {
        authStore.setConfig(options.config.auth);
      }
      if (options.config?.layout) {
        layoutStore.setConfig(options.config.layout);
      }
      appStore.setConfig(options.config);
    }

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
