/**
 * Stores
 */
import useAppStore from "../store/app";
import useConfigStore from "../store/config";
import useResourceStore from "../store/resource";

/**
 * Types
 */
import { AuthConfig } from "../core/types/AuthConfigTypes";
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
} from "../core/types/LayoutConfigTypes";
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
   * Stores
   */
  useAppStore,
  useConfigStore,
  useResourceStore,
};
