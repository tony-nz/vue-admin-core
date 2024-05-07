import { computed } from "vue";
import useAppStore from "../../store/app";

/**
 * Returns layout config
 * @returns {object}
 */
export const config = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig;
});

/**
 * Display breadcrumbs
 * @returns {boolean}
 */
export const displayBreadcrumbs = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.breadcrumbs.display");
});

/**
 * Display page loader
 * @returns {boolean}
 */
export const displayLoader = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.loader.display");
});

/**
 * Display logo
 * @returns {boolean}
 */
export const displayLogo = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.logo.display");
});

/**
 * Display toolbar
 * @returns {boolean}
 */
export const displayToolbar = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.toolbar.display");
});

/**
 * Display scroll to top
 * @returns {boolean}
 */
export const displayScrollTop = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.scrollTop.display");
});

/**
 * Check if layout is fluid or fixed
 * @returns {boolean}
 */
export const layoutWidth = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.theme.display");
});

/**
 * Check if container width is fluid
 * @returns {boolean}
 */
export const contentWidth = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.content.width");
});

/**
 * Page loader logo image
 * @returns {string}
 */
export const loaderLogo = computed(() => {
  const appStore = useAppStore();
  return process.env.BASE_URL + appStore.getAppConfig("layout.loader.logo");
});

/**
 * Logo dark location
 * @returns {string}
 */
export const logoDark = computed(() => {
  const appStore = useAppStore();
  return process.env.BASE_URL + appStore.getAppConfig("layout.logo.dark");
});

/**
 * Logo light location
 * @returns {string}
 */
export const logoLight = computed(() => {
  const appStore = useAppStore();
  return process.env.BASE_URL + appStore.getAppConfig("layout.logo.light");
});

/**
 * Logo alt attribute
 * @returns {string}
 */
export const logoAlt = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.logo.alt");
});

/**
 * Logo class attribute
 * @returns {string}
 */
export const logoClass = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.logo.class");
});

/**
 * Returns dark mode
 * @returns {boolean}
 */
export const darkMode = computed(() => {
  const appStore = useAppStore();
  return appStore.getAppConfig("layout.theme.darkMode");
});

/**
 * Toggle dark mode
 * @returns {boolean}
 */
export const toggleDarkMode = computed(() => {
  const appStore = useAppStore();
  return appStore.toggleDarkMode;
});
/**
 * Toggle toolbar
 * @returns {boolean}
 */
export const toggleToolbar = computed(() => {
  const appStore = useAppStore();
  return appStore.toggleToolbar;
});
