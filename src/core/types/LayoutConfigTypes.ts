interface Theme {
  name?: string;
  version?: string;
  darkMode?: boolean;
  display?: "fixed" | "fluid";
  light?: {
    black?: string;
    white?: string;
    primary?: string;
    secondary?: string;
    success?: string;
    info?: string;
    warning?: string;
    danger?: string;
    light?: string;
    dark?: string;
  };
  dark?: {
    black?: string;
    white?: string;
    primary?: string;
    secondary?: string;
    success?: string;
    info?: string;
    warning?: string;
    danger?: string;
    light?: string;
    dark?: string;
  };
}

interface Logo {
  display?: boolean;
  dark?: string;
  light?: string;
  alt?: string;
  class?: string;
}

interface Loader {
  logo?: string;
  display?: boolean;
  type?: "default" | "spinner-message" | "spinner-logo";
}

interface ScrollTop {
  display?: boolean;
}

interface Fixed {
  desktop?: boolean;
  tabletAndMobile?: boolean;
}

interface Header {
  display?: boolean;
  width?: "fixed" | "fluid";
  fixed?: Fixed;
}

interface Menu {
  display?: boolean;
  width?: "fixed" | "fluid";
  menuIcon?: "svg" | "font";
  fixed?: Fixed;
}

interface Breadcrumb {
  display?: boolean;
}

interface Toolbar {
  display?: boolean;
  width?: "fixed" | "fluid";
}

interface Content {
  width?: "fixed" | "fluid";
}

interface LayoutConfig {
  theme?: Theme;
  logo?: Logo;
  loader?: Loader;
  scrollTop?: ScrollTop;
  header?: Header;
  menu?: Menu;
  breadcrumbs?: Breadcrumb;
  toolbar?: Toolbar;
  content?: Content;
}

export default LayoutConfig;

export type {
  Theme,
  Loader,
  ScrollTop,
  Fixed,
  Header,
  Menu,
  Toolbar,
  Content,
  LayoutConfig,
};
