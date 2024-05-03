/**
 * Stores
 */
import useAuthStore from "../store/auth";
import useBreadcrumbStore from "../store/breadcrumb";
import useConfigStore from "../store/config";
import useNotificationStore from "../store/notification";
import useResourceStore from "../store/resource";
import { useTabsStore } from "../store/tabs";
// import { useTabsStore, ITabsItem } from "../store/tabs";

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
import { IState, ITabsItem } from "../core/types/TabTypes";
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
  IState,
  ITabsItem,
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
  useAuthStore,
  useBreadcrumbStore,
  useConfigStore,
  useNotificationStore,
  useResourceStore,
  useTabsStore,
};
