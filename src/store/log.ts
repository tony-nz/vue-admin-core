import { defineStore } from "pinia";
import { upperCaseFirst } from "../core/helpers/functions";
// import app from "../main";

interface IState {
  api: any;
  error: any;
  warning: any;
  success: any;
}

const LIFE = 3000;

const displayToast = (payload) => {
  if (payload.severity && payload.message) {
    // const toast = app.config.globalProperties.$toast;
    // toast.add({
    //   severity: payload.severity,
    //   summary: payload.summary
    //     ? payload.summary
    //     : upperCaseFirst(payload.severity),
    //   detail: payload.message,
    //   life: payload.life ? payload.life : LIFE,
    // });
  }
};

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
      displayToast({
        severity: payload.severity,
        summary: payload.summary,
        message: payload.message,
      });
    },
  },
  getters: {
    //
  },
});

export default useLogStore;
