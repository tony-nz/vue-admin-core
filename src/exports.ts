/**
 * Stores
 */
import useAppStore from "./store/app";
import useResourceStore from "./store/resource";
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
  useAppStore,
  useResourceStore,
};
