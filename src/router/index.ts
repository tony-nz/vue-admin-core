import { nextFactory } from "./middleware/nextFactory";
import useAppStore from "../store/app";

export async function initRouter(router) {
  /**
   * Router Guards
   * @param to
   * @param from
   * @param next
   */
  router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const appStore = useAppStore();

      if (!appStore.isUserAuthenticated) {
        await appStore
          .verifyAuth(router)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            next({
              path: "/login",
              query: { redirect: to.fullPath },
            });
          });
      }

      if (appStore.isUserAuthenticated) {
        const getPage = to.matched.find((record) => record.meta.page);
        const path = to.path.split("/").filter((item) => item !== "");

        appStore.setBreadcrumb({
          title: to.meta.title,
          pageBreadcrumbPath: path,
          page: getPage ? getPage : null,
        });

        // params for middleware
        const params = {
          userRoles: appStore.getRoles,
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
}
