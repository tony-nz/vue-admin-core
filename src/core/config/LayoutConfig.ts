import { LayoutConfig } from "../types/LayoutTypes";
import defaultLayoutConfig from "./DefaultLayoutConfig";

const config: LayoutConfig = {
  initial: defaultLayoutConfig,
  layout: {},
  menu: {
    apps: {},
    main: [],
    user: {},
  },
};

export default config;
