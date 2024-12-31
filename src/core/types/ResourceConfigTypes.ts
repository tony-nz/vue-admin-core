import type FieldTypes from "../../core/types/FieldTypes";
import type Item from "../../core/types/FieldTypes";

interface List {
  [key: string]: any;
  apiUrl?: string;
  fields?: Array<Item>;
  name?: string;
}

interface ModalPage {
  modal?: boolean;
  page?: boolean;
}

interface Permissions {
  role?: string;
  actions?: Array<string>;
}

interface Notifications {
  all?: boolean;
  error?: boolean;
  create?: boolean;
  delete?: boolean;
  delete_many?: boolean;
  get?: boolean;
  get_list?: boolean;
  get_nodes?: boolean;
  get_one?: boolean;
  get_tree?: boolean;
  update?: boolean;
  update_many?: boolean;
}

interface ResourceConfig {
  apiUrl?: string;
  create?: ModalPage;
  datatable?: any;
  delete?: boolean;
  edit?: ModalPage;
  fields?: Array<FieldTypes>;
  label: string | Function;
  lazy?: boolean;
  lists?: Array<List>;
  name: string;
  nameKey?: string;
  notifications?: Notifications;
  permissions?: Array<Permissions>;
  pluralName?: string;
  primaryKey?: string;
  roles?: Array<string>;
  routes?: Array<string>;
  show?: ModalPage;
  singularName?: string;
  url?: string;
  userApiUrl?: string;
  canAction: (action: string) => boolean;
  getTitle?: (action: string, item?: any) => string;
  getName?: (count: number) => string;
}

export default ResourceConfig;

export type { List, ModalPage, Notifications, Permissions, ResourceConfig };
