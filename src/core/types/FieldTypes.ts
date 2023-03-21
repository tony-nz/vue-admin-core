import { ResourceConfig } from "./ResourceConfigTypes";

interface Conditional {
  field: string;
  value: string | number | boolean;
}

interface Item {
  type?: string;
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  description?: string;
  required?: boolean;
  class?: string;
  options?: Array<any>;
  localData?: Array<any>;
  display?: string;
  optionsUrl?: string;
  optionValue?: string;
  optionsLabel?: string;
  resource?: ResourceConfig;
  editorStyle?: string;
  readonly?: boolean;
  conditional?: Conditional;
}

interface ChildField {
  label?: string;
  class?: string;
  fields?: Array<Item>;
}

interface Field {
  id?: string;
  type?: string;
  label?: string;
  name?: string;
  children?: Array<ChildField>;
  fields?: Array<Field>;
}

export default Field;

export type { Item, ChildField, Field };
