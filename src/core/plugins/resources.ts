import { buildResourceConfig } from "../helpers/resources";
import { useResourceRoutes } from "../../router/resource";
import useAppStore from "../../store/app";
import useResourceStore from "../../store/resource";

/**
 * Initialize resource stores
 * @param router
 */
export const initResources = async function (router) {
  const appStore = useAppStore();
  const resources = appStore.config.resources;

  /**
   * Install resources
   */
  Object.values(resources).forEach((item: any) => {
    const resource = buildResourceConfig(item);

    // Add the resource to the store
    const resourceStore = useResourceStore();
    resourceStore.addResource(resource.name, resource);

    // Add routes for this resource
    router.addRoute("home", useResourceRoutes(resource));
  });
};
