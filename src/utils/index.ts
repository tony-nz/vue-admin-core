/**
 * Composables
 */
import useResource from "../composables/useResource";

/**
 * Services
 */
import ApiService from "../core/services/ApiService";

/**
 * Stores
 */
import useAppStore from "../store/app";
import useAuthStore from "../store/auth";
import useLayoutStore from "../store/layout";
import useResourceStore from "../store/resource";
import useTabStore from "../store/tabs";

/**
 * Types
 */
import { AppConfig } from "../core/types/AppTypes";
import { AuthConfig } from "../core/types/AuthTypes";
import { Item, ChildField, Field } from "../core/types/FieldTypes";
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
} from "../core/types/LayoutTypes";
import { MainMenu } from "../core/types/MainMenuTypes";
import {
  List,
  ModalPage,
  Permissions,
  ResourceConfig,
} from "../core/types/ResourceConfigTypes";
import {
  UserAppMenu,
  MenuItem,
  MenuItemIcon,
} from "../core/types/UserAppsMenuTypes";

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
} from "../core/helpers/functions";

/**
 * Types
 */
export type {
  AppConfig,
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
  useAppStore,
  useAuthStore,
  useLayoutStore,
  useResourceStore,
  useTabStore,
};
