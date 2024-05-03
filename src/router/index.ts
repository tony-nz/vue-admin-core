import { nextFactory } from "./middleware/nextFactory";
import useAuthStore from "../store/auth";
import useBreadcrumbStore from "../store/breadcrumb";

export async function initRouter(router) {
  /**
   * Router Guards
   * @param to
   * @param from
   * @param next
   */
  router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const authStore = useAuthStore();

      if (!authStore.isUserAuthenticated) {
        await authStore
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

      if (authStore.isUserAuthenticated) {
        const breadcrumbStore = useBreadcrumbStore();
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
}
