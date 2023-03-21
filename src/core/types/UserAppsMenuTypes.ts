interface MenuItemIcon {
  name: string;
  fill?: string;
  bg?: string;
  svg?: string;
}

interface MenuItem {
  label: string;
  to: string;
  description?: string;
  slug?: string;
  icon?: Array<MenuItemIcon>;
}

interface UserAppMenu {
  grid?: Array<MenuItem>;
  list?: Array<MenuItem>;
}

export default UserAppMenu;

export type { UserAppMenu, MenuItem, MenuItemIcon };
