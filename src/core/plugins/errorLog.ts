import { App } from "vue";
import useNotificationStore from "../../store/notification";

/**
 * Initialize ErrorLog
 * @param app vue instance
 */
export function initErrorLog(app: App<Element>) {
  const store = useNotificationStore();
  app.config.errorHandler = function (err, vm, info) {
    store.addLog({
      log: "error",
      message: {
        err,
        // vm,
        info,
        url: window.location.href,
      },
    });
  };
  app.config.warnHandler = function (msg, vm, trace) {
    store.addLog({
      log: "warning",
      message: {
        msg,
        // vm,
        trace,
        url: window.location.href,
      },
    });
  };
}
