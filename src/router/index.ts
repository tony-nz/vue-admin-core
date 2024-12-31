import { nextFactory } from "./middleware/nextFactory";
import useAuthStore from "../store/auth";
import useLayoutStore from "../store/layout";

export async function initRouter(router) {
  /**
   * Router Guards
   * @param to
   * @param from
   * @param next
   */
  router.beforeEach(async (to, from, next) => {
    try {
      const whitelist = ["/login", "/register", "/forgot-password"];

      if (whitelist.includes(to.path)) {
        return next();
      }

      if (to.matched.some((record) => record.meta.requiresAuth)) {
        const authStore = useAuthStore();
        const layoutStore = useLayoutStore();

        if (!authStore.isUserAuthenticated) {
          await authStore
            .verifyAuth()
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

        if (authStore.isUserAuthenticated) {
          const getPage = to.matched.find((record) => record.meta.page);
          const path = to.path.split("/").filter((item) => item !== "");

          layoutStore.setBreadcrumb({
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
    } catch (error) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
      console.error(error);
    }
  });
}
