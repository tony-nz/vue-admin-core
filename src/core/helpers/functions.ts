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
        : "data:image/svg+xml;charset=UTF-8;base64," +
            window.btoa(`
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
              <path class="opacity-40" d="M352 128c0 70.69-57.3 128-128 128C153.3 256 96 198.7 96 128s57.31-128 128-128C294.7 0 352 57.31 352 128z"></path>
            </svg>
          `);
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
  const { t, te } = i18n.global;
  if (te(text) && text) {
    return t(text, vars);
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

// Utility for singularization with optional overrides

/**
 * Singularize a label
 * @param label
 * @param customRules
 * @returns singularized label
 * @example
 *  - getSingularizedLabel("Addresses") returns "Address"
 *  - getSingularizedLabel("Users") returns "User"
 *  - getSingularizedLabel("Children", { Children: "Child" }) returns "Child"
 *  - getSingularizedLabel("Men and Women", { Men: "Man", Women: "Woman" }) returns "Man and Woman"
 *
 */
const getSingularizedLabel = (label, customRules = {}) => {
  // Split label into words
  const words = label.split(" ");
  // Function to singularize a word based on rules
  const singularizeWord = (word) => {
    // Check custom overrides first
    if (customRules[word]) return customRules[word];
    // General rule for "es" ending (e.g., "Addresses" → "Address")
    if (word.endsWith("es")) return word.slice(0, -2);
    // General rule for "s" ending (e.g., "Users" → "User")
    if (word.endsWith("s")) return word.slice(0, -1);
    // Default: return the word unchanged
    return word;
  };
  // Singularize only the last word in the label
  if (words.length > 0) {
    words[words.length - 1] = singularizeWord(words[words.length - 1]);
  }
  // Reconstruct the label
  return words.join(" ");
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
