import { buildResourceConfig } from "../helpers/resources";
import { ObjectDirective } from "vue";
import { upperCaseFirst } from "../helpers/functions";
import { useResourceRoutes } from "../../router/resource";
import useAuthStore from "../../store/auth";
import useConfigStore from "../../store/config";
import useResourceStore from "../../store/resource";
/**
 * Initialize resource stores
 * @param app vue instance
 */
function init(router) {
  const resources = useConfigStore().config.resources;
  /**
   * Install resources
   */
  Object.values(resources).forEach((item: any) => {
    const resource = buildResourceConfig(item.resource);
    useResourceStore(resource)();
    router.addRoute("home", useResourceRoutes(resource));
  });
}

export const initResources = async function (app, router) {
  /**
   * Register permission directive
   */
  const permissionDirective: ObjectDirective = {
    mounted: (el, binding) => {
      const store = useAuthStore();
      const permission = binding.value;
      const userPermissions = store.getPermissions;
      if (permission && userPermissions) {
        const hasPermission = userPermissions.includes(permission);
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    },
  };

  /**
   * Apply permission directive
   */
  app.directive("permission", permissionDirective);

  /**
   * Load the resource routes
   */
  init(router);
};
