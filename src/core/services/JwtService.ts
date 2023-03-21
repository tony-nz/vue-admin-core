const ID_TOKEN_KEY = "id_token" as string;
const PERMISSIONS_KEY = "permissions" as string;
const ROLES_KEY = "roles" as string;
const USER_KEY = "user" as string;
const LOCALE_KEY = "locale" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

/**
 * @description get permissions form localStorage
 */
export const getPermissions = () => {
  return window.localStorage.getItem(PERMISSIONS_KEY) as any;
};

/**
 * @description save permissions into localStorage
 * @param permissions: array
 */
export const savePermissions = (permissions: Array<string>): void => {
  window.localStorage.setItem(
    PERMISSIONS_KEY,
    permissions ? JSON.stringify(permissions) : "[]"
  );
};

/**
 * @description remove token form localStorage
 */
export const destroyPermissions = (): void => {
  window.localStorage.removeItem(PERMISSIONS_KEY);
};

/**
 * @description get roles form localStorage
 */
export const getRoles = () => {
  return window.localStorage.getItem(ROLES_KEY) as any;
};

/**
 * @description save roles into localStorage
 * @param roles: array
 */
export const saveRoles = (roles: Array<string>): void => {
  window.localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
};

/**
 * @description remove token form localStorage
 */
export const destroyRoles = (): void => {
  window.localStorage.removeItem(ROLES_KEY);
};

/**
 * @description save user into localStorage
 * @param roles: array
 */
export const saveUser = (user: Array<string>): void => {
  console.log("Saving user");
  console.log(user);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * @description get user form localStorage
 */
export const getUser = () => {
  return window.localStorage.getItem(USER_KEY) as any;
};

/**
 * @description remove user form localStorage
 */
export const destroyUser = (): void => {
  window.localStorage.removeItem(USER_KEY);
};

/**
 * @description get user form localStorage
 */
export const getLocale = () => {
  return window.localStorage.getItem(LOCALE_KEY) as any;
};

/**
 * @description remove locales form localStorage
 */
export const destroyLocales = (): void => {
  window.localStorage.removeItem(LOCALE_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveLocale = (locale: string): void => {
  window.localStorage.setItem(LOCALE_KEY, locale);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  getPermissions,
  savePermissions,
  destroyPermissions,
  getRoles,
  saveRoles,
  destroyRoles,
  saveUser,
  getUser,
  destroyUser,
  getLocale,
  destroyLocales,
  saveLocale,
};
