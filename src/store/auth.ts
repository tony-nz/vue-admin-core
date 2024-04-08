import { defineStore } from "pinia";
import { AuthConfig } from "../core/types/AuthConfigTypes";
import ApiService from "../core/services/ApiService";
import authConfig from "../core/config/AuthConfig";
import i18n from "../core/plugins/i18n";
import objectPath from "object-path";

interface IState {
  errors: string[];
  config: AuthConfig;
  locale: string;
  isAuthenticated: boolean;
  permissions: any;
  user: any;
  roles: any;
  settings: any;
}

const useAuthStore = defineStore({
  id: "AuthStore",
  state: (): IState => ({
    errors: [],
    config: authConfig,
    locale: window.localStorage.getItem("locale") || "en",
    isAuthenticated: false,
    permissions: [],
    user: [],
    roles: [],
    settings:
      JSON.parse(window.sessionStorage.getItem("settings") as string) || {},
  }),
  actions: {
    async login(credentials) {
      await ApiService.get(this.AuthConfig("api.csrfCookie"));
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.AuthConfig("api.login"), credentials)
          .then(({ data }) => {
            this.verifyAuth()
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject();
              });
          })
          .catch(({ response }) => {
            this.setError(response.data.error);
            reject(response);
          });
      });
    },
    loginOauth() {
      ApiService.get(this.AuthConfig("api.csrfCookie"));
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.AuthConfig("oauth.login"))
          .then(({ data }) => {
            window.location.href = data.url;
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
            reject();
          });
      });
    },
    loginOauthCallback(payload) {
      ApiService.get(this.AuthConfig("api.csrfCookie"));
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.AuthConfig("oauth.callback"), payload)
          .then(({ data }) => {
            this.verifyAuth();
            resolve();
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
            reject();
          });
      });
    },
    logout() {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.AuthConfig("api.logout"), {})
          .then(() => {
            this.purgeAuth();
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    register(credentials) {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.AuthConfig("api.register"), credentials)
          .then(({ data }) => {
            this.setAuth(data);
            resolve();
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
            reject();
          });
      });
    },
    forgotPassword(payload) {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.AuthConfig("api.forgotPassword"), payload)
          .then(({ data }) => {
            this.setAuth(data);
            resolve();
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
            reject();
          });
      });
    },
    async verifyAuth() {
      // ApiService.setHeader();
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.AuthConfig("api.verify"))
          .then(({ data }) => {
            this.setAuth(data.data);
            this.getApiSettings();
            resolve();
          })
          .catch(({ response }) => {
            this.purgeAuth();
            if (response) {
              this.setError(response.message);
            }
            this.purgeAuth();
            reject();
          });
      });
    },
    setSettings(settings: any) {
      this.settings = settings;
      window.sessionStorage.setItem("settings", JSON.stringify(this.settings));
    },
    updateSettings(payload) {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.AuthConfig("api.settings"), payload)
          .then(({ data }) => {
            this.setSettings(data.data);
            resolve();
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
            reject();
          });
      });
    },
    async getApiSettings() {
      try {
        const response = await ApiService.get(this.AuthConfig("api.settings"));
        this.setSettings(
          response.data.data ? response.data.data : response.data
        );
      } catch (e) {
        console.log(e);
      }

      return this.settings;
    },
    setAuth(data) {
      this.isAuthenticated = true;
      this.user = data.user;
      this.roles = data.roles;
      this.permissions = data.permissions;
      this.errors = [];
    },
    setError(error) {
      this.errors = error;
    },
    setUser(user) {
      this.user = user;
    },
    setLocale(locale) {
      this.locale = locale;
      i18n.global.locale = locale;
      // JwtService.saveLocale(locale);
    },
    purgeAuth() {
      // delete axios.defaults.auth;
      this.isAuthenticated = false;
      this.user = [];
      this.errors = [];
      this.roles = [];
      this.permissions = [];
    },
    setAuthConfig(config) {
      this.config = config;
    },
  },
  getters: {
    /**
     * Get config from auth config
     * @returns {function(path, defaultValue): *}
     */
    AuthConfig() {
      return (path, defaultValue?) => {
        return objectPath.get(this.config, path, defaultValue);
      };
    },
    /**
     * Auth user
     * @returns object
     */
    authUser(): any {
      return this.user;
    },
    /**
     * Get authentification errors
     * @returns array
     */
    getErrors(): Array<string> {
      return this.errors;
    },
    /**
     * Return the user's locale
     * @returns boolean
     */
    getLocale(): string {
      return this.locale;
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
     * Return current user object
     * @returns User
     */
    getUser(): Array<string> {
      return this.user;
    },
    /**
     * Site settings
     * @returns array
     */
    getSettings(): any {
      Object.keys(this.settings).forEach((key) => {
        // convert "true" and "false" to boolean
        if (this.settings[key] === "true" || this.settings[key] === "false") {
          this.settings[key] = this.settings[key] == "true";
        }
        // convert all string integers
        if (
          typeof this.settings[key] === "string" &&
          /^\d+$/.test(this.settings[key])
        ) {
          this.settings[key] = parseInt(this.settings[key]);
        }
      });

      return this.settings;
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
