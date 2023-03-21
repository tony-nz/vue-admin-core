interface ITabsItem {
  name: string;
  path: string;
  activePath?: string
  title: string;
  query?: {
    [key: string]: any;
  };
  params?: {
    [key: string]: any;
  };
}

interface IState {
  tabs: ITabsItem[];
}

export default IState;

export type { IState, ITabsItem };
