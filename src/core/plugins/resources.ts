import { buildResourceConfig } from "../helpers/resources";
import { useResourceRoutes } from "../../router/resource";
import useAppStore from "../../store/app";
import useResourceStore from "../../store/resource";
/**
 * Initialize resource stores
 * @param router
 */
export const initResources = async function (router) {
  const resources = useAppStore().config.resources;
  /**
   * Install resources
   */
  Object.values(resources).forEach((item: any) => {
    const resource = buildResourceConfig(item);
    useResourceStore(resource)();
    router.addRoute("home", useResourceRoutes(resource));
  });
};
