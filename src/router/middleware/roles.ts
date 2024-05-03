import useAppStore from "../../store/app";

/**
 * Check user role
 * @param roles
 */
function checkUserRole(roles) {
  const store = useAppStore();
  const userRoles = JSON.parse(JSON.stringify(store.getRoles));

  return new Promise<void>((resolve, reject) => {
    if (typeof userRoles === "string") {
      JSON.parse(userRoles).forEach((value) => {
        if (roles.includes(value.name ? value.name : value)) {
          resolve();
        }
      });
    } else {
      userRoles.forEach((value) => {
        if (roles.includes(value.name ? value.name : value)) {
          resolve();
        }
      });
    }

    reject(new Error("[Vue-Admin] Unauthorized access"));
  });
}

/**
 * roles
 * @param next
 * @param to
 * @returns {Promise<void>}
 */
export default function roles({ next, to }) {
  if (to.meta.roles) {
    const roles = Array.isArray(to.meta.roles)
      ? to.meta.roles
      : [to.meta.roles];

    if (roles) {
      checkUserRole(roles)
        .then(() => {
          return next();
        })
        .catch((e) => {
          console.log(e);
          return next({
            path: "403",
          });
        });
    } else {
      return next();
    }
  }
}
