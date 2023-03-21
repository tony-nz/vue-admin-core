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
  sideBar?: boolean;
}

interface Permissions {
  role?: string;
  actions?: Array<string>;
}

interface ResourceConfig {
  name?: string;
  label?: string;
  url?: string;
  apiUrl?: string;
  userApiUrl?: string;
  primaryKey?: string;
  roles?: Array<string>;
  permissions?: Array<Permissions>;
  fields?: Array<FieldTypes>;
  create?: ModalPage;
  show?: ModalPage;
  delete?: boolean;
  edit?: ModalPage;
  routes?: Array<string>;
  lists?: Array<List>;
}

export default ResourceConfig;

export type { List, ModalPage, Permissions, ResourceConfig };
