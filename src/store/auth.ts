import { defineStore } from "pinia";
import { AuthConfig } from "../core/types/AuthTypes";
import ApiService from "../core/services/ApiService";
import authConfig from "../core/config/AuthConfig";
import i18n from "../core/plugins/i18n";
import JwtService from "../core/services/JwtService";
import objectPath from "object-path";
import { useRouter } from "vue-router";

interface IState {
  errors: string[];
  config: AuthConfig;
  locale: string;
  isAuthenticated: boolean;
  permissions: any;
  user: any;
  roles: any;
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
  }),
  actions: {
    login(credentials) {
      ApiService.setHeader();
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.AuthConfig("api.csrfCookie"))
          .then(({ data }) => {
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
                reject();
              });
          })
          .catch(({ response }) => {
            this.setError(response.data.error);
            reject();
          });
      });
    },
    loginOauth() {
      ApiService.setHeader();
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
      ApiService.setHeader();
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
        this.purgeAuth();
        ApiService.post(this.AuthConfig("api.logout"), {})
          .then(() => {
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
      ApiService.setHeader();
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.AuthConfig("api.verify"))
          .then(({ data }) => {
            this.setAuth(data.data);
            resolve();
          })
          .catch(({ response }) => {
            this.purgeAuth();
            if (response) {
              this.setError(response.message);
            }
            reject();
          });
      });
    },
    updateUser(payload) {
      ApiService.setHeader();
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.AuthConfig("api.update"), payload)
          .then(({ data }) => {
            this.setUser(data);
            resolve();
          })
          .catch(({ response }) => {
            this.setError(response.data.errors);
            reject();
          });
      });
    },
    setLocale(locale) {
      this.locale = locale;
      i18n.global.locale = locale;
      JwtService.saveLocale(locale);
    },
    setError(error) {
      this.errors = error;
    },
    setAuth(data) {
      // const locale = data.user.locale ? data.user.locale : "en";
      this.isAuthenticated = true;
      this.user = data.user;
      this.roles = data.roles;
      this.permissions = data.permissions;
      this.errors = [];
    },
    setUser(user) {
      this.user = user;
    },
    purgeAuth() {
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
     * Verify user authentication
     * @returns boolean
     */
    isUserAuthenticated(): boolean {
      return this.isAuthenticated;
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
    getRoles(): Array<string> {
      return this.roles;
    },
    /**
     * User's roles
     * @returns array
     */
    getPermissions(): Array<string> {
      return this.permissions;
    },
    /**
     * User's token
     * @returns array
     */
    userToken(): string | null {
      return JwtService.getToken();
    },
    /**
     * Get authentification errors
     * @returns array
     */
    getErrors(): Array<string> {
      return this.errors;
    },
    /**
     * Return current user object
     * @returns User
     */
    getUser(): Array<string> {
      return this.user;
    },
  },
});

export default useAuthStore;
