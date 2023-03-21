import { defineStore } from "pinia";
import { AuthConfig } from "../core/types/AuthTypes";
import ApiService from "../core/services/ApiService";
import authConfig from "../core/config/AuthConfig";
import i18n from "../core/plugins/i18n";
import JwtService from "../core/services/JwtService";
import objectPath from "object-path";

interface IState {
  counter: number;
  errors: string[];
  user: any;
  locale: string;
  // user = {} as User;
  isAuthenticated: boolean;
  config: AuthConfig;
}

const useAuthStore = defineStore({
  id: "AuthStore",
  state: (): IState => ({
    counter: 0,
    errors: [],
    user: JSON.parse(JwtService.getUser()),
    // user = {} as User;
    locale: window.localStorage.getItem("locale") || "en",
    isAuthenticated: !!JwtService.getToken(),
    config: authConfig,
  }),
  actions: {
    login(credentials) {
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.AuthConfig("api.csrfCookie"))
          .then(({ data }) => {
            ApiService.post(this.AuthConfig("api.login"), credentials)
              .then(({ data }) => {
                this.setAuth(data);
                resolve();
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
            this.setAuth(data);
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
        ApiService.get(this.AuthConfig("api.logout"))
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
        ApiService.post("forgot_password", payload)
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
    verifyAuth() {
      return new Promise<void>((resolve, reject) => {
        if (JwtService.getToken()) {
          ApiService.setHeader();
          ApiService.get(this.AuthConfig("api.verify"))
            .then(({ data }) => {
              // commit(SET_AUTH, data);
              resolve();
            })
            .catch(({ response }) => {
              if (response) {
                this.purgeAuth();
                this.setError(response.message);
              }
              reject();
            });
        } else {
          this.purgeAuth();
          reject();
        }
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
      // TODO::update api server with locale
      // change locale for i18n
      // this.user.locale = locale;
      this.locale = locale;
      i18n.global.locale = locale;
      JwtService.saveLocale(locale);
    },
    setError(error) {
      this.errors = error;
    },
    setAuth(data) {
      const locale = data.user.locale ? data.user.locale : "en";
      this.isAuthenticated = true;
      this.user = data.user;
      this.errors = [];

      JwtService.saveUser(data.user);
      JwtService.saveToken(data.token);
      JwtService.savePermissions(data.permissions);
      JwtService.saveRoles(data.roles);
      JwtService.saveLocale(locale);
    },
    setUser(user) {
      this.user = user;
    },
    setPassword(password) {
      // this.user.password = password;
    },
    purgeAuth() {
      this.isAuthenticated = false;
      this.user = [];
      this.errors = [];
      JwtService.destroyUser();
      JwtService.destroyToken();
      JwtService.destroyPermissions();
      JwtService.destroyRoles();
      JwtService.destroyLocales();
      // this.context.commit(Mutations.SET_LOCALE, "en");
      // TODO:: allow server to return/store locale setting
      // this.context.commit(Mutations.SET_LOCALE, data.locale);
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
    getUserLocale(): string {
      return this.locale;
    },
    /**
     * User's roles
     * @returns array
     */
    userRoles(): Array<string> {
      return JwtService.getRoles();
    },
    /**
     * User's roles
     * @returns array
     */
    userPermissions(): Array<string> {
      return JwtService.getPermissions();
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
    currentUser(): Array<string> {
      // const user = JwtService.getUser();
      // return typeof user !== "undefined" ? JSON.parse(user) : null;
      return this.user;
    },
  },
});

export default useAuthStore;
