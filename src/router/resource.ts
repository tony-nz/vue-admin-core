import { h, resolveComponent, getCurrentInstance, handleError } from "vue";
import { formatKebabCase, upperCaseFirst } from "../core/helpers/functions";
import i18n from "../core/plugins/i18n";
import useAppStore from "../store/app";
import useResourceStore from "../store/resource";
import roles from "./middleware/roles";

export const useResourceRoutes = function (resource) {
  const { name, routes, translatable, getTitle, pluralName } = resource;
  const { t, te, tc } = i18n.global;

  const setTitle = (to, action, item = null) => {
    return (to.meta.title = getTitle(action, item));
  };

  /**
   * CRUD Children
   */
  const crudChildren = [
    { name: "list", path: "" },
    { name: "create", path: "create" },
    { name: "show", path: ":id" },
    { name: "edit", path: ":id/edit" },
  ];

  /**
   * Construct the resource name from the
   * resource name and action
   */
  const resourceName = (name, action) => {
    return `${upperCaseFirst(name) + upperCaseFirst(action)}`;
  };

  /**
   * Build routes for resource
   */
  const buildRoute = (resource: any, action, path) => {
    const appStore = useAppStore();
    const resourceStore = useResourceStore(); // Get the store instance

    try {
      const routerPermissions = []; // Adjust according to your permission structure
      return {
        path,
        name: resourceName(name, action),
        props: true,
        component: {
          render(c) {
            const components = JSON.parse(
              JSON.stringify(getCurrentInstance()?.appContext.components)
            );
            const props = {
              title: getTitle(action),
              resource,
            };
            if (
              Array.prototype.includes.call(
                Object.keys(components),
                resourceName(resource.name, action)
              )
            ) {
              return h(
                resolveComponent(resourceName(resource.name, action)),
                props
              );
            }
            /**
             * Return guesser page component
             */
            return h(
              resolveComponent(`Va${upperCaseFirst(action)}Guesser`),
              props
            );
          },
          async beforeRouteEnter(to, from, next) {
            /**
             * Initialize from query if available
             */
            const id = to.params.id || to.query.source;

            if (id) {
              /**
               * Route model binding
               */
              try {
                const response = await resourceStore.getOne({
                  resourceName: resource.name,
                  payload: {
                    params: { id: id },
                  },
                });

                /**
                 * Insert model into route & resource store
                 */
                // resourceStore.setItem(resource.name, response.data);

                if (to.params.id) {
                  setTitle(to, action, response);
                  return next();
                }
              } catch (error: any) {
                const response = error.response as {
                  data?: { message?: string };
                  status?: number;
                };
                const message = response?.data?.message || "An error occurred";
                const status = response?.status;

                appStore.showToast({
                  severity: "error",
                  summary: message,
                  message:
                    status === 404
                      ? tc("va.pages.notFound", {
                          resource: resource.singularName,
                          id,
                        })
                      : message,
                });
                to.meta.title = message;
                return next();
              }
            }
            setTitle(to, action);
            next();
          },
          beforeRouteLeave(to, from, next) {
            // Here you might want to clear the item from the store if necessary
            // resourceStore.setItem(resource.name, {});
            next();
          },
        },
        meta: {
          isCache: true,
          isLoading: appStore.getApiLoading,
          requiresAuth: true,
          icon: resource.icon,
          layout: resource.layout,
          resource,
          middleware: roles,
          roles: resource.roles,
          permissions: routerPermissions,
        },
      };
    } catch (error) {
      appStore.showToast({
        severity: "error",
        summary: "Error",
        message: "An error occurred",
      });
    }
  };

  /**
   * Return crud routes for this resource
   */
  return {
    path: `${formatKebabCase(resource.url)}`,
    meta: {
      title: upperCaseFirst(resource.name),
      icon: resource.icon,
      isCache: resource.keepAlive || false,
    },
    children: crudChildren
      .filter(({ name }) => routes.includes(name))
      .map(({ name, path }) => buildRoute(resource, name, path)),
  };
};
