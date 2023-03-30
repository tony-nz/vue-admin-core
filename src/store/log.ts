import { defineStore } from "pinia";
import { upperCaseFirst } from "../core/helpers/functions";
import { inject } from "vue";
import { toast, type ToastOptions } from "vue3-toastify";

interface IState {
  api: any;
  error: any;
  warning: any;
  success: any;
}

const LIFE = 3000;

const useLogStore = defineStore({
  id: "LogStore",
  state: (): IState => ({
    api: [],
    error: [],
    warning: [],
    success: [],
  }),
  actions: {
    addLog(payload) {
      if (payload.log === "error") {
        this.error.push(payload.message);
      } else if (payload.log === "warning") {
        this.warning.push(payload.message);
      } else if (payload.log === "api") {
        this.api.push(payload.message);
      } else if (payload.log === "success") {
        this.success.push(payload.message);
      }
    },
    clearLog(log) {
      if (log === "error") {
        this.error.splice(0);
      } else if (log === "warning") {
        this.warning.splice(0);
      } else if (log === "api") {
        this.api.splice(0);
      } else if (log === "success") {
        this.success.splice(0);
      }
    },
    showToast(payload) {
      if (payload.summary) {
        const message = payload.message
          ? `<strong>${payload.summary}</strong>\n` + payload.message
          : payload.summary;
        const options = {
          dangerouslyHTMLString: true, // "dangerous"
          autoClose: 1200,
          type: toast.TYPE.INFO,
          hideProgressBar: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: "colored",
        } as ToastOptions;

        switch (payload.severity) {
          case "error":
            options.type = toast.TYPE.ERROR;
            break;
          case "warning":
            options.type = toast.TYPE.WARNING;
            break;
          case "success":
            options.type = toast.TYPE.SUCCESS;
            break;
          default:
            options.type = toast.TYPE.INFO;
            break;
        }
        toast(message, options);
      }
    },
  },
  getters: {
    //
  },
});

export default useLogStore;
