import { defineStore } from "pinia";
import { toast, type ToastOptions } from "vue3-toastify";
import { version } from "../../package.json";
import AppConfig from "../core/types/AppTypes";
import getConfig from "../core/config/AppConfig";
import i18n from "../core/plugins/i18n";
import objectPath from "object-path";
import ResourceConfig from "../core/types/ResourceConfigTypes";

interface IState {
  api: {
    loading: boolean;
    refresh: boolean;
  };
  appVersion: string;
  config: AppConfig;
  errors: Array<string>;
  notifications: any;
}

const useAppStore = defineStore("AppStore", {
  state: (): IState => ({
    api: {
      loading: false,
      refresh: false,
    },
    appVersion: version || "0",
    errors: [],
    config: getConfig,
    notifications: {
      api: [],
      error: [],
      warning: [],
      success: [],
      echo: null,
    },
  }),
  actions: {
    /**
     * Add log
     * @param payload
     */
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
    /**
     * Clear log
     * @param log
     */
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
     * Find resource
     * @param payload
     * @returns any
     */
    findResource(resourceName: string): any[] {
      try {
        if (!this.config.resources) return [];
        for (const [key, value] of Object.entries(this.config.resources)) {
          const foundResource = value as { name: string } | any;
          if (foundResource?.name === resourceName) {
            return foundResource;
          }
        }
      } catch (e) {
        this.showToast({
          summary: "Error",
          message: "Failed to find resource",
          severity: "error",
        });
      }
      return [];
    },
    /**
     * Set api loading state
     * @param loading
     * @returns void
     */
    setApiLoading(loading: boolean) {
      this.api.loading = loading;
      if (!loading) {
        this.api.refresh = false;
      }
    },
    /**
     * Set api refresh state
     * @param refresh
     */
    setApiRefresh(refresh: boolean) {
      this.api.refresh = refresh;
    },
    /**
     * Set config
     * @param payload
     */
    setConfig(payload) {
      if (payload) {
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
    /**
     * Set errors
     * @param errors
     */
    setErrors(errors) {
      this.errors = errors;
    },
    /**
     * Set locale
     * @param locale
     */
    setLocale(locale) {
      this.config.locale = locale;
      i18n.global.locale = locale;
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
          autoClose: 2500,
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
    /**
     * Update resource
     * @param resource
     */
    updateResource(resource: ResourceConfig): void {
      if (!this.config.resources) return;
      this.config.resources[resource.name] = resource;
    },
  },
  getters: {
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
     * Get config from app config
     * @returns {function(path, defaultValue): *}
     */
    getConfig() {
      return (path, defaultValue?) => {
        return objectPath.get(this.config, path, defaultValue);
      };
    },
    /**
     * Get app version
     */
    getAppVersion(): string {
      return this.appVersion;
    },
    /**
     * Get authentification errors
     * @returns array
     */
    getErrors(): Array<string> {
      return this.errors;
    },
    /**
     * Return the app's locale
     * @returns boolean
     */
    getLocale(): string {
      return this.config.locale;
    },
    /**
     * Get resources
     * @returns object
     */
    getResources(): ResourceConfig[] {
      if (!this.config.resources) return [];
      return this.config.resources;
    },
  },
});

export default useAppStore;
