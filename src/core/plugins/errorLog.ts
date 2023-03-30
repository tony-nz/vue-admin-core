import { App } from "vue";
import useNotificationStore from "../../store/notification";
import settings from "../config/AppConfig";

const { errorLog: needErrorLog } = settings;

const checkNeed = () => {
  const env = process.env.NODE_ENV;
  if (Array.isArray(needErrorLog) && env) {
    return needErrorLog.includes(env);
  }
  return false;
};

/**
 * Initialize ErrorLog
 * @param app vue instance
 */
export function initErrorLog(app: App<Element>) {
  const store = useNotificationStore();
  if (checkNeed()) {
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
}
