import { h, resolveComponent, getCurrentInstance, handleError } from "vue";
import { formatKebabCase, upperCaseFirst } from "../core/helpers/functions";
import i18n from "../core/plugins/i18n";
import useAuthStore from "../store/auth";
import useLogStore from "../store/log";
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
    try {
      const routerPermissions = buildPermissions(resource);
      const store = useResourceStore(resource);
      return {
        path,
        name: resourceName(name, action),
        props: true,
        component: {
          props: ["id", "title", "resource", "store", "permissions"],
          render(c) {
            const authStore = useAuthStore();
            const components = JSON.parse(
              JSON.stringify(getCurrentInstance()?.appContext.components)
            );
            const props = {
              // id: route.params.id,
              title: getTitle,
              resource,
              store,
              permissions: authStore.getPermissions,
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
                  params: { id },
                });

                /**
                 * Insert model into route & resource store
                 */
                store.setItem(data);

                if (to.params.id) {
                  setTitle(to, action, data);
                  return next();
                }
              } catch ({ status, message }) {
                const logStore = useLogStore();
                logStore.showToast({
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
                // document.title = message;
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
          requiresAuth: true,
          layout: resource.layout,
          store,
          resource,
          middleware: roles,
          roles: resource.roles,
          permissions: routerPermissions,
        },
      };
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Return crud routes for this resource
   */
  return {
    path: `${formatKebabCase(resource.url)}`,
    meta: {
      title: upperCaseFirst(resource.name),
      isCache: resource.keepAlive || false,
    },
    children: crudChildren
      .filter(({ name }) => routes.includes(name))
      .map(({ name, path }) => buildRoute(resource, name, path)),
  };
};
