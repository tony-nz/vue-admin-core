import { nextFactory } from "./middleware/nextFactory";

// import NProgress from "nprogress";
// import "nprogress/nprogress.css";

import useAuthStore from "../store/auth";
import useBreadcrumbStore from "../store/breadcrumb";
import useConfigStore from "../store/config";

export async function initRouter(router) {
  /**
   * NProgress Configuration
   * @type {{showSpinner: boolean, easing: string, speed: number}}
   */
  // NProgress.configure({ showSpinner: false, easing: "ease", speed: 1000 });

  /**
   * Workaround for when DOM is not loaded
   */
  document.onreadystatechange = () => {
    if (document.readyState == "complete") {
      // NProgress.configure({ parent: ".bg-breadcrumb-hero" });
    }
  };

  /**
   * Router Guards
   * @param to
   * @param from
   * @param next
   */
  router.beforeEach(async (to, from, next) => {
    // NProgress.start();
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const authStore = useAuthStore();
      await authStore
        .verifyAuth()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });

      if (!authStore.isUserAuthenticated) {
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      } else {
        const configStore = useConfigStore();
        const breadcrumbStore = useBreadcrumbStore();
        configStore.resetLayoutConfig();

        const getPage = to.matched.find((record) => record.meta.page);
        const path = to.path.split("/").filter((item) => item !== "");

        breadcrumbStore.setBreadcrumb({
          title: to.meta.title,
          pageBreadcrumbPath: path,
          page: getPage ? getPage : null,
        });

        // params for middleware
        const params = {
          userRoles: authStore.getRoles,
        };

        // role middleware
        if (to.meta.middleware) {
          const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];

          const nextMiddleware = nextFactory(
            { from, next, router, to },
            middleware,
            1,
            params
          );

          return middleware[0]({
            ...{ from, next, router, to },
            next: nextMiddleware,
          });
        }
      }
    }
    next();
  });

  router.afterEach(() => {
    // complete the progress bar
    // NProgress.done();
  });
}
