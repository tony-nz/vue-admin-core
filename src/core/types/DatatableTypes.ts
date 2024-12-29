interface TableOptions {
  columns?: {
    active?: boolean;
    actions?: boolean;
    select?: boolean;
  };
  loading?: boolean;
  actions?: {
    enabled?: boolean;
  };
}

interface ToolbarOptions {
  visible?: boolean;
  title?: string;
  description?: string;
  buttons?: {
    refresh?: boolean;
    create?: boolean;
    bulkDelete?: boolean;
    search?: boolean;
  };
  search?: {
    enabled: boolean;
    placeholder?: string;
  };
  activeDropdown?: {
    enabled: boolean;
  };
}

export default ToolbarOptions;

export type { TableOptions, ToolbarOptions };
