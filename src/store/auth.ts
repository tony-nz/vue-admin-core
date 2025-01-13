import { defineStore } from "pinia";
import { AuthConfig } from "../core/types/AuthTypes";
import ApiService from "../core/services/ApiService";
import getAuthConfig from "../core/config/AuthConfig";
import objectPath from "object-path";
import useAppStore from "./app";

interface IState {
  config: AuthConfig;
  isAuthenticated: boolean;
  permissions: Array<string>;
  roles: Array<string>;
  settings: any;
  user: Array<string>;
}

const useAuthStore = defineStore("AuthStore", {
  state: (): IState => ({
    config: getAuthConfig,
    isAuthenticated: false,
    permissions: [],
    roles: [],
    settings: {},
    user: [],
  }),
  actions: {
    /**
     * Get api settings
     * @returns Promise<void>
     */
    async getApiSettings() {
      const appStore = useAppStore();
      try {
        const response = await ApiService.get(this.getConfig("api.settings"));
        this.setSettings(
          response.data.data ? response.data.data : response.data
        );
      } catch (e) {
        appStore.showToast({
          summary: "Error",
          message: "Failed to retrieve settings",
          severity: "error",
        });
      }

      return this.settings;
    },
    /**
     * Login user
     * @param credentials
     * @returns Promise<void>
     */
    async login(credentials) {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.getConfig("api.csrfCookie"))
          .then(() => {
            ApiService.post(this.getConfig("api.login"), credentials)
              .then(async ({ data }) => {
                await this.verifyAuth()
                  .then(() => {
                    resolve(data);
                  })
                  .catch(({ response }) => {
                    reject(response);
                  });
              })
              .catch(({ response }) => {
                appStore.setErrors(response.data.error);
                appStore.showToast({
                  summary: "Error",
                  message: "Failed to login user",
                  severity: "error",
                });
                reject(response);
              });
          })
          .catch(({ error }) => {
            appStore.showToast({
              summary: "Error",
              message: "Failed to obtain CSRF token",
              severity: "error",
            });
            reject(error);
          });
      });
    },
    /**
     * Login with OAuth
     * @returns Promise<void>
     */
    loginOauth() {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.getConfig("api.csrfCookie"))
          .then(() => {
            ApiService.get(this.getConfig("oauth.login"))
              .then(({ data }) => {
                window.location.href = data.url;
              })
              .catch(({ response }) => {
                appStore.setErrors(response.data.errors);
                appStore.showToast({
                  summary: "Error",
                  message: "Failed to login with OAuth",
                  severity: "error",
                });
                reject();
              });
          })
          .catch(({ error }) => {
            appStore.showToast({
              summary: "Error",
              message: "Failed to obtain CSRF token",
              severity: "error",
            });
            reject(error);
          });
      });
    },
    /**
     * Login with OAuth callback
     * @param payload
     * @returns Promise<void>
     */
    loginOauthCallback(payload) {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.getConfig("api.csrfCookie"))
          .then(() => {
            ApiService.post(this.getConfig("oauth.callback"), payload)
              .then(({ data }) => {
                this.verifyAuth();
                resolve(data);
              })
              .catch(({ response }) => {
                appStore.setErrors(response.data.errors);
                appStore.showToast({
                  summary: "Error",
                  message: "Failed to login with OAuth",
                  severity: "error",
                });
                reject();
              });
          })
          .catch(({ error }) => {
            appStore.showToast({
              summary: "Error",
              message: "Failed to obtain CSRF token",
              severity: "error",
            });
            reject(error);
          });
      });
    },
    /**
     * Logout user
     * @returns Promise<void>
     */
    logout() {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getConfig("api.logout"), {})
          .then(({ data }) => {
            this.purgeAuth();
            resolve(data);
          })
          .catch(({ response }) => {
            appStore.setErrors(response.data.errors);
            appStore.showToast({
              summary: "Error",
              message: "Failed to logout user",
              severity: "error",
            });
            reject(response);
          });
      });
    },
    /**
     * Register user
     * @param credentials
     * @returns Promise<void>
     */
    register(credentials) {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getConfig("api.register"), credentials)
          .then(({ data }) => {
            this.setAuth(data);
            resolve(data);
          })
          .catch(({ response }) => {
            appStore.setErrors(response.data.errors);
            appStore.showToast({
              summary: "Error",
              message: "Failed to register user",
              severity: "error",
            });
            reject(response);
          });
      });
    },
    /**
     * Forgot password
     * @param payload
     * @returns Promise<void>
     */
    forgotPassword(payload) {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getConfig("api.forgotPassword"), payload)
          .then(({ data }) => {
            this.setAuth(data);
            resolve();
          })
          .catch(({ response }) => {
            appStore.setErrors(response.data.errors);
            appStore.showToast({
              summary: "Error",
              message: "Failed to send password reset email",
              severity: "error",
            });
            reject(response);
          });
      });
    },
    /**
     * Verify user authentication
     * @returns Promise<void>
     */
    async verifyAuth() {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.getConfig("api.verify"))
          .then(async ({ data }) => {
            await this.getApiSettings().then(() => {
              this.setAuth(data.data);
              resolve();
            });
          })
          .catch(({ response }) => {
            this.purgeAuth();
            if (response) {
              appStore.setErrors(response.message);
            }
            this.purgeAuth();
            appStore.showToast({
              summary: "Error",
              message: "Failed to verify authentication",
              severity: "error",
            });
            reject(response);
          });
      });
    },
    /**
     * Purge user authentication
     * @returns void
     */
    purgeAuth() {
      const appStore = useAppStore();
      appStore.setErrors([]);
      this.setIsAuthenticated(false);
      this.setPermissions([]);
      this.setRoles([]);
      this.setUser([]);
    },
    /**
     * Set auth config
     * @param payload
     * @returns void
     */
    setConfig(payload) {
      /**
       * Initialize API Config
       */
      if (payload.api) {
        this.config.api = payload.api;
      }
      if (payload.oauth) {
        this.config.oauth = payload.oauth;
      }
    },
    /**
     * Set user authentication
     * @param data
     */
    setAuth(data) {
      const appStore = useAppStore();
      appStore.setErrors([]);
      this.setIsAuthenticated(true);
      this.setPermissions(data.permissions);
      this.setRoles(data.roles);
      this.setUser(data.user);
    },
    /**
     * Set user authentication
     * @param isAuthenticated
     * @returns void
     */
    setIsAuthenticated(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    /**
     * Set permissions
     * @param permissions
     * @returns void
     */
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    /**
     * Set roles
     * @param roles
     * @returns void
     */
    setRoles(roles) {
      this.roles = roles;
    },
    /**
     * Set settings
     * @param settings
     * @returns void
     */
    setSettings(settings: any) {
      this.settings = settings;
    },
    /**
     * Set user
     * @param user
     * @returns void
     */
    setUser(user) {
      this.user = user;
    },
    /**
     * Update settings
     * @param payload
     * @returns Promise<void>
     */
    updateSettings(payload) {
      const appStore = useAppStore();
      return new Promise<void>((resolve, reject) => {
        ApiService.put(this.getConfig("api.settings"), payload)
          .then(({ data }) => {
            this.setSettings(data.data);
            appStore.showToast({
              summary: "Success",
              message: "Settings saved successfully",
              severity: "success",
            });
            resolve(data);
          })
          .catch(({ response }) => {
            appStore.showToast({
              summary: "Error",
              message: "Failed to update settings",
              severity: "error",
            });
            appStore.setErrors(response.data.errors);
          });
      });
    },
  },
  getters: {
    /**
     * Get config from app config
     * @returns {function(path, defaultValue): *}
     */
    getConfig() {
      return (path, defaultValue?) => {
        return objectPath.get(this.config, path, defaultValue);
      };
    },
    /**
     * User's roles
     * @returns array
     */
    getPermissions(): Array<string> {
      return this.permissions;
    },
    /**
     * User's roles
     * @returns array
     */
    getRoles(): Array<string> {
      return this.roles;
    },
    /**
     * Get setting from settings
     * @returns {function(setting): *}
     */
    getSetting(): any {
      return (setting) => {
        // if setting is "true" or "false" return boolean
        if (
          objectPath.get(this.settings, setting) === "true" ||
          objectPath.get(this.settings, setting) === "false"
        ) {
          return objectPath.get(this.settings, setting) == "true";
        }

        return objectPath.get(this.settings, setting);
      };
    },
    /**
     * Site settings
     * @returns array
     */
    getSettings(): any {
      return this.settings;
    },
    /**
     * Return current user object
     * @returns User
     */
    getUser(): Array<string> {
      return this.user;
    },
    /**
     * Verify user authentication
     * @returns boolean
     */
    isUserAuthenticated(): boolean {
      return this.isAuthenticated;
    },
  },
});

export default useAuthStore;
