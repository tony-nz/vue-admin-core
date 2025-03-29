import { App } from "vue";
import PrimeVue from "primevue/config";
import DialogService from "primevue/dialogservice";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

// directives
import BadgeDirective from "primevue/badgedirective";
import KeyFilter from "primevue/keyfilter";
import Tooltip from "primevue/tooltip";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";

// components
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DataView from "primevue/dataview";
import Dialog from "primevue/dialog";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

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
  app.directive("keyfilter", KeyFilter);

  // register components
  app.component("Button", Button);
  app.component("DataTable", DataTable);
  app.component("Column", Column);
  app.component("DataView", DataView);
  app.component("Dialog", Dialog);
  app.component("ConfirmPopup", ConfirmPopup);
  app.component("Toast", Toast);

  // providers
  app.provide("toast", app.config.globalProperties.$toast);
}
