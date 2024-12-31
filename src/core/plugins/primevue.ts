import { App } from "vue";
import PrimeVue from "primevue/config";
import DialogService from "primevue/dialogservice";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

// directives
import BadgeDirective from "primevue/badgedirective";
import Tooltip from "primevue/tooltip";

// components
import AutoComplete from "primevue/autocomplete";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Badge from "primevue/badge";
import BlockUI from "primevue/blockui";
import Button from "primevue/button";
import Breadcrumb from "primevue/breadcrumb";
import DatePicker from "primevue/datepicker"; // Changed from Calendar
import Card from "primevue/card";
import CascadeSelect from "primevue/cascadeselect";
import Carousel from "primevue/carousel";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import Chips from "primevue/chips";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
import ContextMenu from "primevue/contextmenu";
import DataTable from "primevue/datatable";
import DataView from "primevue/dataview";
import DeferredContent from "primevue/deferredcontent";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Dock from "primevue/dock";
import Select from "primevue/select"; // Changed from Dropdown
import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";
import Galleria from "primevue/galleria";
import Image from "primevue/image";
import Inplace from "primevue/inplace";
import ToggleSwitch from "primevue/toggleswitch"; // Changed from InputSwitch
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import Knob from "primevue/knob";
import Listbox from "primevue/listbox";
import MegaMenu from "primevue/megamenu";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import OrderList from "primevue/orderlist";
import OrganizationChart from "primevue/organizationchart";
import Popover from "primevue/popover"; // Changed from OverlayPanel
import Paginator from "primevue/paginator";
import Panel from "primevue/panel";
import PanelMenu from "primevue/panelmenu";
import Password from "primevue/password";
import PickList from "primevue/picklist";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import Rating from "primevue/rating";
import RadioButton from "primevue/radiobutton";
import Ripple from "primevue/ripple";
import Row from "primevue/row";
import SelectButton from "primevue/selectbutton";
import ScrollPanel from "primevue/scrollpanel";
import ScrollTop from "primevue/scrolltop";
import Skeleton from "primevue/skeleton";
import Slider from "primevue/slider";
import Drawer from "primevue/drawer"; // Changed from Sidebar
import SpeedDial from "primevue/speeddial";
import SplitButton from "primevue/splitbutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Stepper from "primevue/stepper"; // New component, replaces Steps in some contexts
import StyleClass from "primevue/styleclass";
import TabMenu from "primevue/tabmenu";
import TieredMenu from "primevue/tieredmenu";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
import Tabs from "primevue/tabs"; // Changed from TabView
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tag from "primevue/tag";
import Terminal from "primevue/terminal";
import Timeline from "primevue/timeline";
import ToggleButton from "primevue/togglebutton";
import Tree from "primevue/tree";
import TreeSelect from "primevue/treeselect";
import TreeTable from "primevue/treetable";
import VirtualScroller from "primevue/virtualscroller";

/**
 * Initialize PrimeVUE component
 * @param app vue instance
 */
export function initPrimeVue(app: App<Element>) {
  app.use(PrimeVue, { theme: "none" });

  // register services
  app.use(ToastService);
  app.use(ConfirmationService);
  app.use(DialogService);

  // register directives
  app.directive("tooltip", Tooltip);
  app.directive("badge", BadgeDirective);
  app.directive("ripple", Ripple);
  app.directive("styleclass", StyleClass);

  // register components
  app.component("AutoComplete", AutoComplete);
  app.component("Accordion", Accordion);
  app.component("AccordionTab", AccordionTab);
  app.component("Avatar", Avatar);
  app.component("AvatarGroup", AvatarGroup);
  app.component("Badge", Badge);
  app.component("BlockUI", BlockUI);
  app.component("Button", Button);
  app.component("Breadcrumb", Breadcrumb);
  app.component("DatePicker", DatePicker);
  app.component("Card", Card);
  app.component("CascadeSelect", CascadeSelect);
  app.component("Carousel", Carousel);
  app.component("Checkbox", Checkbox);
  app.component("Chip", Chip);
  app.component("Chips", Chips);
  app.component("ColorPicker", ColorPicker);
  app.component("Column", Column);
  app.component("ColumnGroup", ColumnGroup);
  app.component("ConfirmDialog", ConfirmDialog);
  app.component("ConfirmPopup", ConfirmPopup);
  app.component("ContextMenu", ContextMenu);
  app.component("DataTable", DataTable);
  app.component("DataView", DataView);
  app.component("DeferredContent", DeferredContent);
  app.component("Dialog", Dialog);
  app.component("Divider", Divider);
  app.component("Dock", Dock);
  app.component("Select", Select);
  app.component("Fieldset", Fieldset);
  app.component("FileUpload", FileUpload);
  app.component("Galleria", Galleria);
  app.component("Image", Image);
  app.component("Inplace", Inplace);
  app.component("ToggleSwitch", ToggleSwitch);
  app.component("InputText", InputText);
  app.component("InputMask", InputMask);
  app.component("InputNumber", InputNumber);
  app.component("Knob", Knob);
  app.component("Listbox", Listbox);
  app.component("MegaMenu", MegaMenu);
  app.component("Menu", Menu);
  app.component("Menubar", Menubar);
  app.component("Message", Message);
  app.component("MultiSelect", MultiSelect);
  app.component("OrderList", OrderList);
  app.component("OrganizationChart", OrganizationChart);
  app.component("Popover", Popover);
  app.component("Paginator", Paginator);
  app.component("Panel", Panel);
  app.component("PanelMenu", PanelMenu);
  app.component("Password", Password);
  app.component("PickList", PickList);
  app.component("ProgressBar", ProgressBar);
  app.component("ProgressSpinner", ProgressSpinner);
  app.component("Rating", Rating);
  app.component("RadioButton", RadioButton);
  app.component("Row", Row);
  app.component("SelectButton", SelectButton);
  app.component("ScrollPanel", ScrollPanel);
  app.component("ScrollTop", ScrollTop);
  app.component("Skeleton", Skeleton);
  app.component("Slider", Slider);
  app.component("Drawer", Drawer);
  app.component("SpeedDial", SpeedDial);
  app.component("SplitButton", SplitButton);
  app.component("Splitter", Splitter);
  app.component("SplitterPanel", SplitterPanel);
  app.component("Stepper", Stepper);
  app.component("TabMenu", TabMenu);
  app.component("TieredMenu", TieredMenu);
  app.component("Textarea", Textarea);
  app.component("Toast", Toast);
  app.component("Toolbar", Toolbar);
  app.component("Tabs", Tabs);
  app.component("TabPanel", TabPanel);
  app.component("TabPanels", TabPanels);
  app.component("Tag", Tag);
  app.component("Terminal", Terminal);
  app.component("Timeline", Timeline);
  app.component("ToggleButton", ToggleButton);
  app.component("Tree", Tree);
  app.component("TreeSelect", TreeSelect);
  app.component("TreeTable", TreeTable);
  app.component("VirtualScroller", VirtualScroller);

  // providers
  app.provide("toast", app.config.globalProperties.$toast);
}
