import i18n from "../plugins/i18n";
import { ref, onBeforeUnmount } from "vue";

/**
 * Return a base64 string for avatars
 * @param {string} avatar base64 avatar
 */
const getBase64Avatar = (avatar) => {
  try {
    if (atob(avatar)) {
      return avatar
        ? "data:image/jpeg;base64," +
            avatar.replace(/_/g, "/").replace(/-/g, "+")
        : "/media/avatars/blank.png";
    }
  } catch (err) {
    return avatar;
  }
};

/**
 * Convert ISO 8601 (YYYY-MM-DDT00:00:00.000Z) to DD-MM-YYYY 00:00 PM
 * @param {string} isoDate
 */
const cleanDate = (isoDate) => {
  if (isoDate) {
    const newDateTime = new Date(isoDate);
    const newDate = newDateTime
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("-");
    const newTime = newDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (newDate == "01-01-1970") {
      return "Never logged in";
    } else {
      return newDate + " " + newTime;
    }
  }
};

/**
 * Translate defined text into current locale
 * @param {string} text
 */
function translate(text, vars = {}) {
  const { t, te, tc } = i18n.global;
  if (te(text) && text) {
    return tc(text, vars);
  } else {
    return text;
  }
}

const useCurrentTime = () => {
  const currentTime = ref(new Date());
  const updateCurrentTime = () => {
    currentTime.value = new Date();
  };
  const updateTimeInterval = setInterval(updateCurrentTime, 1000);
  onBeforeUnmount(() => {
    clearInterval(updateTimeInterval);
  });
  return {
    currentTime,
  };
};

const formatTitleCase = (string: string) =>
  string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");

const formatKebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const upperCaseFirst = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const goBack = () => window.history.back();

const checkWeekend = (date) => {
  if (date == "Sat" || date == "Sun") {
    return false;
  } else {
    return true;
  }
};

const today = new Date().toLocaleDateString().split("/").reverse().join("-");

const getSingularizedLabel = (label) => {
  // singularize label
  if (label.slice(-1) == "s") {
    return label.substring(0, label.length - 1);
  }
  return label;
};

export {
  getBase64Avatar,
  cleanDate,
  translate,
  useCurrentTime,
  formatTitleCase,
  formatKebabCase,
  upperCaseFirst,
  goBack,
  checkWeekend,
  today,
  getSingularizedLabel,
};
