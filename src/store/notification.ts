import { defineStore } from "pinia";
import { toast, type ToastOptions } from "vue3-toastify";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

interface IState {
  api: any;
  error: any;
  warning: any;
  success: any;
  echo: any;
}

const LIFE = 3000;

const useNotificationStore = defineStore({
  id: "LogStore",
  state: (): IState => ({
    api: [],
    error: [],
    warning: [],
    success: [],
    echo: null,
  }),
  actions: {
    initEchoPusher() {
      window.Pusher = Pusher;

      this.echo = new Echo({
        broadcaster: "pusher",
        key: process.env.VUE_APP_PUSHER_APP_KEY,
        cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
        forceTLS: true,
        // Other configurations if needed
      });
    },

    listenToChannel() {
      // Access Echo instance and listen to events
      this.echo.channel("notification").listen("YourEventName", (event) => {
        console.log("Received event:", event);
        // Handle the received event data here within the store
        // Update state or trigger mutations/actions as needed
      });
    },
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

export default useNotificationStore;
