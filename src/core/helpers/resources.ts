import { formatKebabCase, upperCaseFirst } from "./functions";
// import useAuthStore from "../../store/auth";
// const authStore = useAuthStore();
/**
 * Permissions helper & directive
 */
const can = (permissions) => {
  if (Array.isArray(permissions)) {
    return permissions;
  }
  return true;
  // return authStore.userPermissions;
};

/**
 * Get full resource object meta from name
 */
const getResource = (name) => {
  // app.config.globalProperties.$resources.find((r) => r.name === name);
  return name;
};

/**
 * Resource link helper with action permission test
 */
const getResourceLink = (link) => {
  const getLink = ({ name, icon, text, action }: any) => {
    action = action || "list";
    const resource = getResource(name);

    if (!resource) {
      return false;
    }

    const { routes, canAction, singularName, pluralName } = resource;

    /**
     * Route must exist
     */
    if (!routes.includes(action)) {
      return false;
    }

    /**
     * Current user must have permission for this action
     */
    if (!canAction(action)) {
      return false;
    }

    return {
      icon: icon || resource.icon,
      text: text || (action === "list" ? pluralName : singularName),
      link: { name: `${name}_${action}` },
    };
  };

  if (typeof link === "object") {
    return getLink(link);
  }
  return getLink({ name: link });
};

/**
 * Resource links list helper
 */
const getResourceLinks = (links) => {
  return links
    .map((link) => {
      if (typeof link === "object") {
        if (link.children) {
          return link;
        }

        return getResourceLink(link);
      }
      return getResourceLink({ name: link });
    })
    .filter((r) => r);
};

/**
 * Build path based on route and resource url
 */
const buildPath = (route, resource) => {
  if (route === "list") {
    return resource.url;
  } else if (route === "create") {
    return resource.url + "/create";
  } else if (route === "edit") {
    return resource.url + "/:id";
  } else if (route === "show") {
    return resource.url + "/:id";
  }
  return resource.url;
};

/**
 * Build resource name from route and resource
 */
const resourceName = (route, resource) => {
  return `${upperCaseFirst(resource.name) + upperCaseFirst(route)}`;
};

const buildResourceConfig = (resource) => {
  /**
   * Get valid routes
   */
  const routes = ["list", "show", "create", "edit"].filter((name) => {
    return !resource.routes || resource.routes.includes(name);
  });

  /**
   * Get valid actions
   */
  const actions = ["list", "show", "create", "edit", "delete"].filter(
    (name) => {
      if ((resource.actions || []).length) {
        return resource.actions.includes(name);
      }

      if ((resource.except || []).length) {
        return !resource.except.includes(name);
      }

      return true;
    }
  );
  const nameKey = `resources.${resource.name}.name`;
  const getName = (count) => {
    return (
      resource.name.charAt(0).toUpperCase() +
      resource.name.slice(1).toLowerCase()
    );
  };

  return {
    ...resource,
    icon: resource.icon || "mdi-view-grid",
    routes,
    actions,
    getName,
    nameKey,
    singularName: getName(1),
    pluralName: getName(10),
    // getTitle: (action, item: any = null) => {
    //   const titleKey = `resources.${r.name}.titles.${action}`;

    //   if (item) {
    //     return (
    //       (translate(titleKey)
    //         ? translate(titleKey, item)
    //         : i18n.t(`va.pages.${action}`, {
    //             resource: getName(1).toLowerCase(),
    //             label:
    //               typeof r.label === "function"
    //                 ? r.label(item)
    //                 : item[r.label],
    //           })) + ` #${item.id}`
    //     );
    //   }
    //   return i18n.te(titleKey)
    //     ? i18n.t(titleKey)
    //     : i18n.t(`va.pages.${action}`, {
    //         resource: getName(action === "list" ? 10 : 1).toLowerCase(),
    //       });
    // },
    canAction: (action) => {
      /**
       * Test if action exist for this resource
       */
      if (!actions.includes(action)) {
        return false;
      }

      /**
       * OK if no permissions set
       */
      if (!resource.permissions) {
        return true;
      }

      /**
       * Get permissions for asked action
       */
      const permissions = (resource.permissions || [])
        .filter((p) => {
          return typeof p === "string" || p.actions.includes(action);
        })
        .map((p) => {
          return typeof p === "string" ? p : p.name;
        });

      // Test if current user can access
      return permissions.length && can(permissions);
    },
  };
};

const dataFilter = (filters, resource) => {
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
  // return resource;
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
