import { buildResourceConfig } from "../helpers/resources";
import { useResourceRoutes } from "../../router/resource";
import useConfigStore from "../../store/config";
import useResourceStore from "../../store/resource";
/**
 * Initialize resource stores
 * @param router
 */
export const initResources = async function (router) {
  const resources = useConfigStore().config.resources;
  /**
   * Install resources
   */
  Object.values(resources).forEach((item: any) => {
    const resource = buildResourceConfig(item);
    useResourceStore(resource)();
    router.addRoute("home", useResourceRoutes(resource));
  });
};
