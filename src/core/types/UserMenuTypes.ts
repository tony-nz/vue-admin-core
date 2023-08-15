interface Items {
  label?: string;
  to?: string;
  slug?: string;
  icon?: string;
  command?: any;
}
interface Menu {
  items: Items[];
}

interface UserMenu {
  header?: boolean;
  footer?: boolean;
  seperators?: boolean;
  menu?: Menu[];
}

export default UserMenu;

export type { UserMenu };
