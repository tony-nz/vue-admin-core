/**
 * All UI Vue Components
 */
import * as resources from "./components/resources";
import * as ui from "./components/ui";
import * as layout from "./layouts";

/**
 * Import CSS
 */
import "./assets/style.css";

/**
 * Import Pinia
 */
import { createPinia } from "pinia";

/**
 * Composables
 */
import useResource from "./composables/useResource";

/**
 * Services
 */
import ApiService from "./core/services/ApiService";

/**
 * Stores
 */
import useApiStore from "./store/api";
import useAuthStore from "./store/auth";
import useBreadcrumbStore from "./store/breadcrumb";
import useConfigStore from "./store/config";
import useNotificationStore from "./store/notification";
import useResourceStore from "./store/resource";
import { useTabsStore } from "./store/tabs";
// import { useTabsStore, ITabsItem } from "./store/tabs";

/**
 * Types
 */
import { AuthConfig } from "./core/types/AuthConfigTypes";
import { Item, ChildField, Field } from "./core/types/FieldTypes";
import {
  Theme,
  Loader,
  ScrollTop,
  Fixed,
  Header,
  Menu,
  Toolbar,
  Content,
  LayoutConfig,
} from "./core/types/LayoutConfigTypes";
import { MainMenu } from "./core/types/MainMenuTypes";
import {
  List,
  ModalPage,
  Permissions,
  ResourceConfig,
} from "./core/types/ResourceConfigTypes";
import { IState, ITabsItem } from "./core/types/TabTypes";
import {
  UserAppMenu,
  MenuItem,
  MenuItemIcon,
} from "./core/types/UserAppsMenuTypes";

/**
 * Helpers
 */
import {
  checkWeekend,
  cleanDate,
  formatKebabCase,
  formatTitleCase,
  getBase64Avatar,
  getSingularizedLabel,
  goBack,
  today,
  translate,
  useCurrentTime,
  upperCaseFirst,
} from "./core/helpers/functions";

/**w
 * VueAdmin class
 */
import VueAdmin from "./admin";

/**
 * Main admin entry
 */

const VueAdminPlugin = {
  install(app, options: any) {
    /**
     * Register Pinia
     */
    app.use(createPinia());

    /**
     * Register VueAdmin
     */
    app.component("VueAdmin", new VueAdmin({ app, options }));

    /**
     * Register VueAdmin components
     */
    [resources, ui, layout].forEach((component) => {
      Object.keys(component).forEach((name) => {
        app.component(`Va${name}`, component[name]);
      });
    });

    /**
     * Inject global admin conf
     */
    app.config.globalProperties.$admin = VueAdmin;
  },
};

/**
 * Types
 */
export type {
  AuthConfig,
  Item,
  ChildField,
  Field,
  Theme,
  Loader,
  ScrollTop,
  Fixed,
  Header,
  Menu,
  Content,
  Toolbar,
  LayoutConfig,
  MainMenu,
  List,
  ModalPage,
  Permissions,
  ResourceConfig,
  IState,
  ITabsItem,
  UserAppMenu,
  MenuItem,
  MenuItemIcon,
};

export {
  /**
   * Composables
   */
  useResource,

  /**
   * Helpers
   */
  checkWeekend,
  cleanDate,
  formatKebabCase,
  formatTitleCase,
  getBase64Avatar,
  getSingularizedLabel,
  goBack,
  today,
  translate,
  useCurrentTime,
  upperCaseFirst,

  /**
   * Services
   */
  ApiService,
  
  /**
   * Stores
   */
  useApiStore,
  useAuthStore,
  useBreadcrumbStore,
  useConfigStore,
  useNotificationStore,
  useResourceStore,
  useTabsStore,
};

export default VueAdminPlugin;
