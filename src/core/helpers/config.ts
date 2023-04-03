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
 * Set the aside display
 * @returns {boolean}
 */
export const displayAside = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("aside.display");
});

/**
 * Set the logo display
 * @returns {boolean}
 */
export const displayLogo = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("main.logo.display");
});

/**
 * Set the sidebar display
 * @returns {boolean}
 */
export const displaySidebar = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("sidebar.display");
});

/**
 * Set the subheader display
 * @returns {boolean}
 */
export const displaySubheader = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("toolbar.display");
});

/**
 * Set the toolbar display
 * @returns {boolean}
 */
export const displayToolbar = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("toolbar.display");
});

/**
 * Check if footer container is fluid
 * @returns {boolean}
 */
export const footerWidthFluid = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("footer.width");
});

/**
 * Check if top menu container is fluid
 * @returns {boolean}
 */
export const topMenuWidthFluid = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("topMenu.width");
});

/**
 * Check if secondary menu container is fluid
 * @returns {boolean}
 */
export const secondaryMenuWidthFluid = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("secondaryMenu.width");
});

/**
 * Check if toolbar width is fluid
 * @returns {boolean}
 */
export const toolbarWidthFluid = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("toolbar.width");
});

/**
 * Check if the page loader is enabled
 * @returns {boolean}
 */
export const loaderEnabled = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("loader.display");
});

/**
 * Check if container width is fluid
 * @returns {boolean}
 */
export const contentWidthFluid = computed(() => {
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
 * Logo alt attribute
 * @returns {string}
 */
export const logoAlt = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("main.logo.alt");
});

/**
 * Logo class attribute
 * @returns {string}
 */
export const logoClass = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("main.logo.class");
});

/**
 * Check if the aside menu is enabled
 * @returns {boolean}
 */
export const asideEnabled = computed(() => {
  const configStore = useConfigStore();
  return !!configStore.getLayoutConfig("aside.display");
});

/**
 * Set the aside theme
 * @returns {string}
 */
export const asideTheme = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("aside.theme");
});

/**
 * Set the aside menu icon type
 * @returns {string}
 */
export const asideMenuIcons = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("aside.menuIcon");
});

/**
 * Light theme logo image
 * @returns {string}
 */
export const themeLightLogo = computed(() => {
  const configStore = useConfigStore();
  return process.env.BASE_URL + configStore.getLayoutConfig("main.logo.light");
});

/**
 * Dark theme logo image
 * @returns {string}
 */
export const themeDarkLogo = computed(() => {
  const configStore = useConfigStore();
  return process.env.BASE_URL + configStore.getLayoutConfig("main.logo.dark");
});

/**
 * Set the header menu icon type
 * @returns {string}
 */
export const headerMenuIcons = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("header.menuIcon");
});

/**
 * Theme style
 * @returns {boolean}
 */
export const themeStyle = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("themeStyle");
});

/**
 * Get dark mode
 * @returns {boolean}
 */
export const darkMode = computed(() => {
  const configStore = useConfigStore();
  return configStore.getLayoutConfig("darkMode");
});

/**
 * Toggle dark mode
 * @returns {boolean}
 */
export const toggleDarkMode = computed(() => {
  const configStore = useConfigStore();
  return configStore.toggleDarkMode;
});
