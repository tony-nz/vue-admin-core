/**
 * Stores
 */
import useAuthStore from "./store/auth";
import useBreadcrumbStore from "./store/breadcrumb";
import useConfigStore from "./store/config";
import useNotificationStore from "./store/notification";
import useResourceStore from "./store/resource";
import { useTabsStore, ITabsItem } from "./store/tabs";
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
  useCurrentTime,
  upperCaseFirst,
} from "./core/helpers/functions";

/**
 * Types
 */
export type { ITabsItem };

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
