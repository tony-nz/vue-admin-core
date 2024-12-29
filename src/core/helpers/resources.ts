import { formatKebabCase, upperCaseFirst } from "./functions";
import i18n from "../plugins/i18n";
import useAppStore from "../../store/app";

/**
 * Checks if a value is empty
 * @param value - The value to check for emptiness
 * @returns {boolean} - True if the value is considered empty, false otherwise
 */
const isEmpty = (value: any): boolean => {
  if (Array.isArray(value)) return value.length === 0;
  if (value && typeof value === "object")
    return Object.keys(value).length === 0;
  return !value;
};

/**
 * Checks if the user has the specified permission
 * @param permission - The permission to check
 * @returns {boolean} - True if the user has the permission, false otherwise
 */
const can = (permission: string): boolean => {
  const appStore = useAppStore();
  if (!permission) return false;
  return appStore.getPermissions.includes(permission);
};

/**
 * Gets the full resource object meta from name
 * @param name - Name of the resource
 * @returns {string} - Returns the name, should be enhanced to return full resource object
 */
const getResource = (name: string): any => {
  const appStore = useAppStore();
  return appStore.config.resources.find(
    (resource: any) => resource.name === name
  );
};

/**
 * Creates a resource link with action permission check
 * @param link - Either a string (resource name) or an object with link details
 * @returns {Object | false} - Object with link details or false if conditions not met
 */
const getResourceLink = (link: string | any): Object | false => {
  const getLink = ({ name, icon, text, action = "list" }: any) => {
    const resource = getResource(name);
    if (!resource) return false;

    const { routes, canAction, singularName, pluralName } = buildResourceConfig(
      { name, routes: [], actions: [] }
    ); // Mocked for simplicity

    if (!routes.includes(action)) return false;
    if (!canAction(action)) return false;

    return {
      icon: icon || resource.icon,
      text: text || (action === "list" ? pluralName : singularName),
      link: { name: `${name}_${action}` },
    };
  };

  return typeof link === "object" ? getLink(link) : getLink({ name: link });
};

/**
 * Generates a list of resource links
 * @param links - Array of link objects or strings
 * @returns {Array} - Filtered array of valid resource links
 */
const getResourceLinks = (links: (string | any)[]): any[] => {
  return links
    .map((link) => {
      if (typeof link === "object") {
        return link.children ? link : getResourceLink(link);
      }
      return getResourceLink({ name: link });
    })
    .filter(Boolean);
};

/**
 * Builds the path based on the route and resource URL
 * @param route - Route identifier
 * @param resource - Resource object
 * @returns {string} - Constructed path
 */
const buildPath = (route: string, resource: any): string => {
  const paths: { [key: string]: string } = {
    list: resource.url,
    create: `${resource.url}/create`,
    edit: `${resource.url}/:id`,
    show: `${resource.url}/:id`,
  };
  return paths[route] || resource.url;
};

/**
 * Constructs the resource name from route and resource
 * @param route - Route identifier
 * @param resource - Resource object
 * @returns {string} - Formatted resource name
 */
const resourceName = (route: string, resource: any): string => {
  return `${upperCaseFirst(resource.name)}${upperCaseFirst(route)}`;
};

/**
 * Constructs a resource configuration object
 * @param resource - Base resource configuration
 * @returns {Object} - Extended resource configuration
 */
const buildResourceConfig = (resource: any): any => {
  const routes = ["list", "show", "create", "edit"].filter(
    (name) => !resource.routes || resource.routes.includes(name)
  );
  const actions = [
    "list",
    "show",
    "create",
    "edit",
    "update",
    "read",
    "delete",
  ].filter((name) => {
    return (
      !resource.actions ||
      resource.actions.includes(name) ||
      (resource.except && !resource.except.includes(name))
    );
  });

  const nameKey = `resources.${resource.name}.name`;
  const { t, te, tc } = i18n.global;

  const getName = (count: number): string => {
    return te(nameKey)
      ? tc(nameKey, count)
      : formatKebabCase(upperCaseFirst(resource.name));
  };

  const resourceConfig = {
    ...resource,
    icon: resource.icon || "",
    routes,
    actions,
    getName,
    nameKey,
    singularName: getName(1),
    pluralName: getName(10),
    getTitle: (action: string, item: any = null) => {
      // check if the resource has a label function
      if (typeof resource.label === "function") {
        return resource.label(item, action);
      }
      const titleKey = `resources.${resource.name}.titles.${action}`;
      const label =
        typeof resource.label === "function"
          ? resource.label(item)
          : item?.[resource.label];

      if (item) {
        return `${
          te(titleKey)
            ? tc(titleKey, item)
            : tc(`va.pages.${action}`, {
                resource: getName(1).toLowerCase(),
                label,
              })
        } #${item.id}`;
      }
      return te(titleKey)
        ? t(titleKey)
        : tc(`va.pages.${action}`, {
            resource: getName(action === "list" ? 10 : 1).toLowerCase(),
          });
    },
    canAction: (action: string): boolean => {
      if (!actions.includes(action)) return false;
      if (!resource.permissions) return true;

      const { getRoles } = useAppStore();
      return (
        resource.permissions?.some(
          (perm) =>
            getRoles?.includes(perm.role) &&
            perm.actions.includes(action) &&
            can(`${action}-${resource.name}`)
        ) || false
      );
    },
  };

  useAppStore().updateResource(resourceConfig);
  return resourceConfig;
};

/**
 * Filters data based on given filters
 * @param filters - Object containing filter criteria
 * @param resource - Array of resource items to filter
 * @returns {Array} - Filtered array of resource items
 */
const dataFilter = (filters: any, resource: any[]) => {
  /*
   * Check for prop filters to filter the resource results
   * e.g. filters = { name: "Reading", id: 1 }
   */
  if (filters && Object.keys(filters).length !== 0) {
    return resource.filter((item) => {
      let returnValue = true;
      for (const key in filters) {
        if (filters[key] === true && item[key] !== null) {
          returnValue = true;
        } else if (item[key] === undefined || item[key] != filters[key]) {
          returnValue = false;
        }
      }
      return returnValue;
    });
  }
};

export {
  dataFilter,
  getResourceLinks,
  getResourceLink,
  getResource,
  buildPath,
  buildResourceConfig,
  resourceName,
};
