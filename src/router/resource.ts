import { h, resolveComponent, getCurrentInstance } from "vue";
import { formatKebabCase, upperCaseFirst } from "../core/helpers/functions";
import i18n from "../core/plugins/i18n";
import useAppStore from "../store/app";
import useResourceStore from "../store/resource";
import useTabsStore from "../store/tabs";
import roles from "./middleware/roles";

export const useResourceRoutes = function (resource) {
  const { name, routes, translatable, getTitle, pluralName } = resource;
  const { t, te } = i18n.global;

  const appStore = useAppStore();
  const resourceStore = useResourceStore();
  const tabsStore = useTabsStore();

  const setTitle = (to, action, item = null) => {
    return (to.meta.title = getTitle(action, item));
  };

  const crudChildren = [
    { name: "list", path: "" },
    { name: "create", path: "create" },
    { name: "show", path: ":id" },
    { name: "edit", path: ":id/edit" },
  ];

  const resourceName = (name, action) => {
    return `${upperCaseFirst(name) + upperCaseFirst(action)}`;
  };

  const buildRoute = (resource: any, action, path) => {
    const routeName = resourceName(name, action);
    const routerPermissions = []; // Adjust according to your permission structure

    try {
      return {
        path,
        name: routeName,
        props: true,
        component: {
          render(c) {
            const components =
              getCurrentInstance()?.appContext.components || {};
            const props = {
              title: getTitle(action),
              resource,
            };
            if (routeName in components) {
              return h(resolveComponent(routeName), props);
            }
            return h(
              resolveComponent(`Va${upperCaseFirst(action)}Guesser`),
              props
            );
          },
          async beforeRouteEnter(to, from, next) {
            const cachedTab = tabsStore.getTabs.find(
              (tab) => tab.path === to.fullPath
            );

            if (cachedTab) {
              return next();
            }

            const id = to.params.id || to.query.source;

            if (id) {
              try {
                const response = await resourceStore.getOne({
                  resourceName: resource.name,
                  payload: {
                    params: { id: id },
                  },
                });

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
                      ? t("va.pages.notFound", {
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
            next();
          },
        },
        meta: {
          isCache: true,
          isLoading: appStore.getApiLoading,
          requiresAuth: true,
          icon: resource.icon,
          layout: resource.layout,
          resource: resource.name, // Store only the name
          middleware: roles,
          roles: resource.roles,
          permissions: routerPermissions,
        },
      };
    } catch (error) {
      console.error("Error building route:", error);
      appStore.showToast({
        severity: "error",
        summary: "Error",
        message: "An error occurred",
      });
      throw error;
    }
  };

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
