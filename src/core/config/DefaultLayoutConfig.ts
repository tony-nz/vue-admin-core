import LayoutConfigTypes from "../types/LayoutConfigTypes";

const config: LayoutConfigTypes = {
  themeName: "VueAdmin",
  themeVersion: "1.0.0",
  themeStyle: "style2",
  display: "fluid",
  darkMode: false,
  demo: true,
  main: {
    type: "default",
    primaryColor: "#009EF7",
    logo: {
      dark: "media/logos/logo-light.svg",
      light: "media/logos/logo-light.svg",
    },
  },
  loader: {
    logo: "media/logos/logo-dark.svg",
    display: true,
    type: "default",
  },
  scrollTop: {
    display: true,
  },
  header: {
    display: true,
    menuIcon: "font",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  topMenu: {
    display: true,
    menuIcon: "font",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  secondaryMenu: {
    display: true,
    menuIcon: "font",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  toolbar: {
    display: true,
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  aside: {
    display: true,
    theme: "dark",
    fixed: true,
    menuIcon: "font",
    minimized: false,
    minimize: true,
    hoverable: true,
  },
  content: {
    width: "fluid",
  },
  footer: {
    width: "fluid",
  },
};

export default config;
