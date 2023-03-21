/**
 * Stores
 */
import useApiStore from "./store/api";
import useAuthStore from "./store/auth";
import useBreadcrumbStore from "./store/breadcrumb";
import useConfigStore from "./store/config";
import useLogStore from "./store/log";
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
  useApiStore,
  useAuthStore,
  useBreadcrumbStore,
  useConfigStore,
  useLogStore,
  useResourceStore,
  useTabsStore,
};
