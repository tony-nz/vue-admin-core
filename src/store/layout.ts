import { defineStore } from "pinia";
import getLayoutConfig from "../core/config/LayoutConfig";
import LayoutTypes from "../core/types/LayoutTypes";
import objectPath from "object-path";
import UserMenu from "../core/types/UserMenuTypes";
import UserAppMenu from "../core/types/UserAppsMenuTypes";
import type MainMenu from "../core/types/MainMenuTypes";

interface IState {
  config: LayoutTypes;
  breadcrumbs: Breadcrumb;
}

interface Breadcrumb {
  title: string;
  pageBreadcrumbPath: Array<string>;
  page: string;
}

const useLayoutStore = defineStore("LayoutStore", {
  state: (): IState => ({
    breadcrumbs: {} as Breadcrumb,
    config: getLayoutConfig,
  }),
  actions: {
    setBreadcrumb(payload) {
      // this.breadcrumbs = payload;
    },
    setConfig(payload) {
      if (payload) {
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
      }
    },
    toggleDarkMode(): void {
      const element = document.body;
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
  },
  getters: {
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
      // TODO bugged, causes pinia to free
      // this.config.layout = this.config.initial = Object.assign(
      //   {},
      //   this.config.initial,
      //   JSON.parse(window.localStorage.getItem("layoutConfig") || "{}")
      // );
    },
    getDarkMode(): boolean {
      return this.config.layout.theme?.darkMode
        ? this.config.layout.theme?.darkMode
        : false;
    },
    getConfig(): any {
      return (path, defaultValue?) => {
        return objectPath.get(this.config, path, defaultValue);
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
  },
});

export default useLayoutStore;
