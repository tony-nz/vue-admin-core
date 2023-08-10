import { computed } from "vue";
import useConfigStore from "../../store/config";

/**
 * Returns layout config
 * @returns {object}
 */
export const config = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig;
});

/**
 * Display breadcrumbs
 * @returns {boolean}
 */
export const displayBreadcrumbs = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("breadcrumbs.display");
});

/**
 * Display page loader
 * @returns {boolean}
 */
export const displayLoader = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("loader.display");
});

/**
 * Display logo
 * @returns {boolean}
 */
export const displayLogo = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("logo.display");
});

/**
 * Display toolbar
 * @returns {boolean}
 */
export const displayToolbar = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("toolbar.display");
});

/**
 * Display scroll to top
 * @returns {boolean}
 */
export const displayScrollTop = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("scrollTop.display");
});

/**
 * Check if layout is fluid or fixed
 * @returns {boolean}
 */
export const layoutWidth = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("theme.display");
});

/**
 * Check if container width is fluid
 * @returns {boolean}
 */
export const contentWidth = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("content.width");
});

/**
 * Page loader logo image
 * @returns {string}
 */
export const loaderLogo = computed(() => {
  const configStore = useConfigStore();
  return process.env.BASE_URL + configStore.getLayoutConfig("loader.logo");
});

/**
 * Logo dark location
 * @returns {string}
 */
export const logoDark = computed(() => {
  const configStore = useConfigStore();
  return process.env.BASE_URL + configStore.getLayoutConfig("logo.dark");
});

/**
 * Logo light location
 * @returns {string}
 */
export const logoLight = computed(() => {
  const configStore = useConfigStore();
  return process.env.BASE_URL + configStore.getLayoutConfig("logo.light");
});

/**
 * Logo alt attribute
 * @returns {string}
 */
export const logoAlt = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("logo.alt");
});

/**
 * Logo class attribute
 * @returns {string}
 */
export const logoClass = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("logo.class");
});

/**
 * Returns dark mode
 * @returns {boolean}
 */
export const darkMode = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("theme.darkMode");
});

/**
 * Toggle dark mode
 * @returns {boolean}
 */
export const toggleDarkMode = computed(() => {
  const configStore = useConfigStore();
  return configStore.toggleDarkMode;
});
/**
 * Toggle toolbar
 * @returns {boolean}
 */
export const toggleToolbar = computed(() => {
  const configStore = useConfigStore();
  return configStore.toggleToolbar;
});
