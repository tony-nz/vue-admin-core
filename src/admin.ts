import { initPlugins } from "./core/plugins/init";
import { initRouter } from "./router";
import useAppStore from "./store/app";

export default class VueAdmin {
  constructor({ app, options }) {
    const router = options.router;
    const appStore = useAppStore();

    /**
     * Initialize Config
     */
    if (options?.config) {
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
