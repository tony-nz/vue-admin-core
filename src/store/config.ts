import { defineStore } from "pinia";
import defaultLayoutConfig from "../core/config/DefaultLayoutConfig";
import LayoutConfigTypes from "../core/types/LayoutConfigTypes";
import UserAppMenu from "../core/types/UserAppsMenuTypes";
import type MainMenu from "../core/types/MainMenuTypes";
import objectPath from "object-path";
import merge from "deepmerge";
import i18n from "../core/plugins/i18n";

interface Config {
  initial: LayoutConfigTypes;
  layout: LayoutConfigTypes;
  locale: string;
  menu: {
    apps: UserAppMenu;
    user: UserAppMenu[];
    main: MainMenu[];
  };
  resources: any[];
}

interface IState {
  config: Config;
}

const useConfigStore = defineStore({
  id: "ConfigStore",
  state: (): IState => ({
    config: {
      initial: defaultLayoutConfig,
      layout: defaultLayoutConfig,
      locale: window.localStorage.getItem("locale") || "en",
      menu: {
        apps: {},
        main: [],
        user: [],
      },
      resources: [],
    },
  }),
  actions: {
    setConfig(payload): void {
      /**
       * Initialize Apps Menu Configure
       */
      if (payload?.menu?.apps) {
        this.setMenuApps(payload.menu.apps);
      }

      /**
       * Initialize Main Menu Configure
       */
      if (payload?.menu?.main) {
        this.setMenuMain(payload.menu.main);
      }

      /**
       * Initialize User Menu Configure
       */
      if (payload?.menu?.user) {
        this.setMenuUser(payload.menu.user);
      }

      /**
       * Initialize Layout Configure
       */
      if (payload?.layout) {
        this.setLayout(payload.layout);
      }

      /**
       * Initialize Resources
       */
      if (payload?.resources) {
        this.setResources(Object.assign({}, payload.resources));
      }
    },
    setMenuMain(payload): void {
      const data = payload.value ? payload.value : payload;
      this.config.menu.main = data;
    },
    setMenuApps(payload): void {
      this.config.menu.apps = payload;
    },
    setMenuUser(payload): void {
      this.config.menu.user = payload;
    },
    setResources(payload): void {
      this.config.resources = payload;
    },
    setLayout(payload): void {
      this.config.layout = payload;
    },
    setLocale(payload): void {
      i18n.global.locale = payload;
      this.config.locale = payload;
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
    overridePageLayoutConfig(state, payload: object): void {
      this.config.layout = merge(this.config.layout, payload);
    },
    toggleDarkMode(): void {
      const element = document.getElementById("vueadmin-app");
      this.config.layout.darkMode = !this.config.layout.darkMode;
      const localStorageConfig = Object.assign(
        {},
        JSON.parse(window.localStorage.getItem("layoutConfig") || "{}")
      );
      if (element) {
        if (this.config.layout.darkMode) {
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
  },
  getters: {
    getDarkMode(): boolean {
      return this.config.layout.darkMode ? this.config.layout.darkMode : false;
    },
    getLayoutConfig(): any {
      return (path, defaultValue?) => {
        return objectPath.get(this.config.layout, path, defaultValue);
      };
    },
    getLayout(): any {
      return this.config.layout;
    },
    getLocale(): any {
      return this.config.locale;
    },
    getAppMenu(): UserAppMenu {
      return this.config.menu.apps;
    },
    getMainMenu(): MainMenu[] {
      return this.config.menu.main;
    },
    getUserMenu(): UserAppMenu[] {
      return this.config.menu.user;
    },
    getResources(): any[] {
      return this.config.resources;
    },
  },
});

export default useConfigStore;
