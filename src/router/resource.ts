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
   *
   */
  const buildPermissions = (resource) => {
    const permissions = [];
    if (resource.permissions) {
      Object.keys(resource.permissions).forEach(function (key) {
        Object.keys(resource.permissions[key].actions).forEach(function (
          actionKey
        ) {
          permissions[actionKey] =
            resource.name + "-" + resource.permissions[key].actions[actionKey];
        });
      });
    }
    return permissions;
  };

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
    try {
      const routerPermissions = buildPermissions(resource);
      const store = useResourceStore(resource)();
      const appStore = useAppStore();
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
              permissions: appStore.getPermissions,
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
                const { data } = await store.getOne({
                  id,
                });

                /**
                 * Insert model into route & resource store
                 */
                store.setItem(store, data);

                if (to.params.id) {
                  setTitle(to, action, data);
                  return next();
                }
              } catch ({ status, message }: any) {
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
            next();
          },
          beforeRouteLeave(to, from, next) {
            // store.removeItem();
            next();
          },
        },
        meta: {
          isCache: true,
          isLoading: appStore.getApiLoading,
          requiresAuth: true,
          icon: resource.icon,
          layout: resource.layout,
          store,
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
