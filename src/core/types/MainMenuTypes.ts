interface MenuItemIcon {
  name: string;
  fill?: string;
  bg?: string;
  svg?: string;
}

interface MenuItem {
  divider: boolean;
  external: string;
  label: string;
  to: string;
  icon?: string;
  items?: Array<MenuItem>;
}

interface MainMenu {
  label?: string;
  to?: string;
  bg?: string;
  color?: string;
  class?: string;
  slug?: string;
  svgIcon?: string;
  icon?: Array<MenuItemIcon>;
  items?: Array<MenuItem>;
}

export default MainMenu;

export type { MainMenu, MenuItem, MenuItemIcon };
