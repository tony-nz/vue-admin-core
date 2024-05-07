import { App, Breadcrumb } from "../core/types/AppTypes";
import { defineStore } from "pinia";
import { initResources } from "../core/plugins/resources";
import ApiService from "../core/services/ApiService";
import getAppConfig from "../core/config/AppConfig";
import i18n from "../core/plugins/i18n";
import objectPath from "object-path";
import { toast, type ToastOptions } from "vue3-toastify";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import UserMenu from "../core/types/UserMenuTypes";
import UserAppMenu from "../core/types/UserAppsMenuTypes";
import type MainMenu from "../core/types/MainMenuTypes";

const useAppStore = defineStore({
  id: "AppStore",
  state: (): App => ({
    api: {
      loading: false,
      refresh: false,
    },
    breadcrumbs: {} as Breadcrumb,
    errors: [],
    config: getAppConfig,
    locale: window.localStorage.getItem("locale") || "en",
    isAuthenticated: false,
    permissions: [],
    notifications: {
      api: [],
      error: [],
      warning: [],
      success: [],
      echo: null,
    },
    roles: [],
    settings:
      JSON.parse(window.sessionStorage.getItem("settings") as string) || {},
    user: [],
  }),
  actions: {
    /**
     * Login user
     * @param credentials
     * @param router
     * @returns Promise<void>
     */
    async login(credentials, router) {
      await ApiService.get(this.getAppConfig("api.csrfCookie"));
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getAppConfig("api.login"), credentials)
          .then(({ data }) => {
            this.verifyAuth(router)
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject();
              });
          })
          .catch(({ response }) => {
            this.setErrors(response.data.error);
            reject(response);
          });
      });
    },
    /**
     * Login with OAuth
     * @returns Promise<void>
     */
    loginOauth() {
      ApiService.get(this.getAppConfig("api.csrfCookie"));
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.getAppConfig("oauth.login"))
          .then(({ data }) => {
            window.location.href = data.url;
          })
          .catch(({ response }) => {
            this.setErrors(response.data.errors);
            reject();
          });
      });
    },
    /**
     * Login with OAuth callback
     * @param payload
     * @param router
     * @returns Promise<void>
     */
    loginOauthCallback(payload, router) {
      ApiService.get(this.getAppConfig("api.csrfCookie"));
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getAppConfig("oauth.callback"), payload)
          .then(({ data }) => {
            this.verifyAuth(router);
            resolve();
          })
          .catch(({ response }) => {
            this.setErrors(response.data.errors);
            reject();
          });
      });
    },
    /**
     * Logout user
     * @returns Promise<void>
     */
    logout() {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getAppConfig("api.logout"), {})
          .then(() => {
            this.purgeAuth();
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * Register user
     * @param credentials
     * @param router
     * @returns Promise<void>
     */
    register(credentials, router) {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getAppConfig("api.register"), credentials)
          .then(({ data }) => {
            this.setAuth(data, router);
            resolve();
          })
          .catch(({ response }) => {
            this.setErrors(response.data.errors);
            reject();
          });
      });
    },
    /**
     * Forgot password
     * @param payload
     * @param router
     * @returns Promise<void>
     */
    forgotPassword(payload, router) {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(this.getAppConfig("api.forgotPassword"), payload)
          .then(({ data }) => {
            this.setAuth(data, router);
            resolve();
          })
          .catch(({ response }) => {
            this.setErrors(response.data.errors);
            reject();
          });
      });
    },
    /**
     * Verify user authentication
     * @param router
     * @returns Promise<void>
     */
    async verifyAuth(router) {
      return new Promise<void>((resolve, reject) => {
        ApiService.get(this.getAppConfig("api.verify"))
          .then(({ data }) => {
            this.setAuth(data.data, router);
            this.getApiSettings();
            resolve();
          })
          .catch(({ response }) => {
            this.purgeAuth();
            if (response) {
              this.setErrors(response.message);
            }
            this.purgeAuth();
            reject();
          });
      });
    },
    /** SETTERS **/
    setApiLoading(loading) {
      this.api.loading = loading;
      if (!loading) {
        this.api.refresh = false;
      }
    },
    setApiRefresh(refresh) {
      this.api.refresh = refresh;
    },
    setBreadcrumb(payload) {
      this.breadcrumbs = payload;
    },
    setErrors(errors) {
      this.errors = errors;
    },
    setConfig(payload) {
      if (payload) {
        /**
         * Initialize API Config
         */
        if (payload.api) {
          this.config.api = payload.api;
        }

        /**
         * Initialize Layout Config
         */
        if (payload.layout) {
          this.config.layout = payload.layout;
        }

        /**
         * Initialize Menu Config
         */
        if (payload.menu) {
          if (payload.menu.apps) {
            this.config.menu.apps = payload.menu.apps;
          }
          if (payload.menu.main) {
            this.config.menu.main = payload.menu.main;
          }
          if (payload.menu.user) {
            this.config.menu.user = payload.menu.user;
          }
        }

        /**
         * Initialize OAuth Config
         */
        if (payload.oauth) {
          this.config.oauth = { ...this.config.oauth, ...payload.oauth };
        }

        /**
         * Initialize Resources Config
         */
        if (payload.resources) {
          this.config.resources = {
            ...this.config.resources,
            ...payload.resources,
          };
        }

        /**
         * Initialize Locale
         */
        if (payload.locale) {
          this.config.locale = payload.locale;
        }
      }
    },
    setLocale(locale) {
      this.locale = locale;
      i18n.global.locale = locale;
    },
    setIsAuthenticated(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setRoles(roles) {
      this.roles = roles;
    },
    setSettings(settings: any) {
      this.settings = settings;
      window.sessionStorage.setItem("settings", JSON.stringify(this.settings));
    },
    setUser(user) {
      this.user = user;
    },
    /**
     * Update settings
     * @param payload
     * @returns Promise<void>
     */
    updateSettings(payload) {
      return new Promise<void>((resolve, reject) => {
        ApiService.put(this.getAppConfig("api.settings"), payload)
          .then(({ data }) => {
            this.setSettings(data.data);
            resolve();
          })
          .catch(({ response }) => {
            this.setErrors(response.data.errors);
            reject();
          });
      });
    },
    /**
     * Get api settings
     * @returns Promise<void>
     */
    async getApiSettings() {
      try {
        const response = await ApiService.get(
          this.getAppConfig("api.settings")
        );
        this.setSettings(
          response.data.data ? response.data.data : response.data
        );
      } catch (e) {
        console.log(e);
      }

      return this.settings;
    },
    /**
     * Set user authentication
     * @param data
     * @param router
     */
    setAuth(data, router) {
      this.setErrors([]);
      this.setIsAuthenticated(true);
      this.setPermissions(data.permissions);
      this.setRoles(data.roles);
      this.setUser(data.user);
      // Load CRUD Resources
      // initResources(router);
    },
    /**
     * Purge user authentication
     * @returns void
     */
    purgeAuth() {
      this.setErrors([]);
      this.setIsAuthenticated(false);
      this.setPermissions([]);
      this.setRoles([]);
      this.setUser([]);
    },
    /**
     * Initialize Echo Pusher
     * @returns void
     */
    initEchoPusher() {
      window.Pusher = Pusher;

      this.notifications.echo = new Echo({
        broadcaster: "pusher",
        key: process.env.VUE_APP_PUSHER_APP_KEY,
        cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
        forceTLS: true,
        // Other configurations if needed
      });
    },
    /**
     * Listen to channel
     * @returns void
     */
    listenToChannel() {
      // Access Echo instance and listen to events
      this.notifications.echo
        .channel("notification")
        .listen("YourEventName", (event) => {
          console.log("Received event:", event);
          // Handle the received event data here within the store
          // Update state or trigger mutations/actions as needed
        });
    },
    addLog(payload) {
      if (payload.log === "error") {
        this.notifications.error.push(payload.message);
      } else if (payload.log === "warning") {
        this.notifications.warning.push(payload.message);
      } else if (payload.log === "api") {
        this.notifications.api.push(payload.message);
      } else if (payload.log === "success") {
        this.notifications.success.push(payload.message);
      }
    },
    clearLog(log) {
      if (log === "error") {
        this.notifications.error.splice(0);
      } else if (log === "warning") {
        this.notifications.warning.splice(0);
      } else if (log === "api") {
        this.notifications.api.splice(0);
      } else if (log === "success") {
        this.notifications.success.splice(0);
      }
    },
    /**
     * Show toast notification
     * @param payload
     */
    showToast(payload) {
      if (payload.summary) {
        const message = payload.message
          ? `<strong>${payload.summary}</strong>\n` + payload.message
          : payload.summary;
        const options = {
          dangerouslyHTMLString: true, // "dangerous"
          autoClose: 1200,
          type: toast.TYPE.INFO,
          hideProgressBar: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: "colored",
        } as ToastOptions;

        switch (payload.severity) {
          case "error":
            options.type = toast.TYPE.ERROR;
            break;
          case "warning":
            options.type = toast.TYPE.WARNING;
            break;
          case "success":
            options.type = toast.TYPE.SUCCESS;
            break;
          default:
            options.type = toast.TYPE.INFO;
            break;
        }
        toast(message, options);
      }
    },
    toggleDarkMode(): void {
      const element = document.getElementById("vueadmin-app");

      if (this.config.layout.theme) {
        this.config.layout.theme.darkMode = !this.config.layout.theme?.darkMode;
      }

      const localStorageConfig = Object.assign(
        {},
        JSON.parse(window.localStorage.getItem("layoutConfig") || "{}")
      );
      if (element) {
        if (this.config.layout.theme?.darkMode) {
          localStorageConfig["darkMode"] = true;
          element.classList.add("dark");
        } else {
          localStorageConfig["darkMode"] = false;
          element.classList.remove("dark");
        }
      }
      if (localStorageConfig) {
        localStorage.setItem(
          "layoutConfig",
          JSON.stringify(localStorageConfig)
        );
      }
    },
    toggleToolbar(): void {
      const localStorageConfig = Object.assign(
        {},
        JSON.parse(window.localStorage.getItem("layoutConfig") || "{}")
      );
      if (this.config.layout.toolbar?.display) {
        localStorageConfig["toolbar"] = {
          ...localStorageConfig["toolbar"],
          display: false,
        };
        this.config.layout.toolbar.display = false;
      } else if (this.config.layout.toolbar?.display === false) {
        localStorageConfig["toolbar"] = {
          ...localStorageConfig["toolbar"],
          display: true,
        };
        this.config.layout.toolbar.display = true;
      }
      if (localStorageConfig) {
        localStorage.setItem(
          "layoutConfig",
          JSON.stringify(localStorageConfig)
        );
      }
    },
    updateResource(resource): void {
      this.config.resources[resource.name] = resource;
    },
    findResource(payload: any): any[] {
      try {
        for (const [key, value] of Object.entries(this.config.resources)) {
          const foundResource = value as { name: string } | any;
          if (foundResource?.name === payload) {
            return foundResource;
          }
        }
      } catch (e) {
        // TODO ERROR LOG
        console.log(e);
      }
      return [];
    },
  },
  getters: {
    /**
     * Get config from app config
     * @returns {function(path, defaultValue): *}
     */
    getAppConfig() {
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
    /**
     * Get api loading state
     * @returns object
     */
    getApiLoading(): boolean {
      return this.api.loading;
    },
    /**
     * Get api refresh state
     * @returns object
     */
    getApiRefresh(): boolean {
      return this.api.refresh;
    },
    /**
     * breadcrumb object for current page
     * @returns object
     */
    getBreadcrumbs(): Breadcrumb {
      return this.breadcrumbs;
    },
    /**
     * breadcrumb array for current page
     * @returns object
     */
    pageBreadcrumbPath(): Array<string> {
      return this.breadcrumbs.pageBreadcrumbPath;
    },
    /**
     * current page title
     * @returns string
     */
    pageTitle(): string {
      return this.breadcrumbs.title;
    },
    /**
     * current page title
     * @returns string
     */
    currentPage(): string {
      return this.breadcrumbs.page;
    },
    resetLayoutConfig() {
      this.config.layout = Object.assign({}, this.config.initial);
    },
    overrideLayoutConfig(): void {
      this.config.layout = this.config.initial = Object.assign(
        {},
        this.config.initial,
        JSON.parse(window.localStorage.getItem("layoutConfig") || "{}")
      );
    },
    getDarkMode(): boolean {
      return this.config.layout.theme?.darkMode
        ? this.config.layout.theme?.darkMode
        : false;
    },
    getLayoutConfig(): any {
      return (path, defaultValue?) => {
        return objectPath.get(this.config.layout, path, defaultValue);
      };
    },
    getLayout(): any {
      return this.config.layout;
    },
    getAppMenu(): UserAppMenu {
      return this.config.menu.apps;
    },
    getMainMenu(): MainMenu[] {
      return this.config.menu.main;
    },
    getUserMenu(): UserMenu {
      return this.config.menu.user;
    },
    getResources(): any[] {
      return this.config.resources;
    },
  },
});

export default useAppStore;
