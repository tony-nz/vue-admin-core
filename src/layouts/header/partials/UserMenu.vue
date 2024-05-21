<template>
  <div
    v-if="isMounted"
    @mouseover="showMenu"
    @mouseleave="hideMenu"
    class="relative inline-block text-left"
  >
    <button
      @click="showMenu"
      type="button"
      class="flex text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white w-10"
      id="userMenuBtn"
      x-ref="button"
      aria-haspopup="true"
      aria-controls="userMenu"
    >
      <span class="sr-only">Open user menu</span>
      <button
        class="fill-white hover:bg-white hover:fill-primary-300 dark:hover:bg-slate-800 rounded-lg p-2"
      >
        <img
          v-if="getUser['avatar']"
          class="h-10 w-10 rounded-lg"
          :src="getUser['avatar']"
          :alt="getUser['name']"
        />
        <span v-else>
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
            />
            <path
              class="opacity-40"
              d="M352 128c0 70.69-57.3 128-128 128C153.3 256 96 198.7 96 128s57.31-128 128-128C294.7 0 352 57.31 352 128z"
            />
          </svg>
        </span>
      </button>
    </button>

    <transition
      v-if="isVisible"
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        role="menu"
        tabindex="0"
        class="origin-top-right rounded-lg absolute right-0 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
      >
        <div
          v-if="userMenuConfig.header"
          class="px-4 py-3 rounded-t-lg bg-primary-500 dark:bg-slate-800 shadow"
        >
          <p class="text-sm text-gray-100">Signed in as</p>
          <p class="text-sm font-medium text-white truncate">
            {{ getUser["email"] }}
          </p>
        </div>
        <div v-for="(item, index) in userMenuConfig.menu" :key="index">
          <div
            v-for="(menu, idx) in item.items"
            :key="idx"
            class="bg-white dark:bg-slate-700"
          >
            <router-link
              v-if="menu.to"
              :to="menu.to"
              custom
              v-slot="{ navigate }"
            >
              <button @click="processMenuCommand(navigate)" :class="mnuClass">
                {{ translate(menu.label) }}
              </button>
            </router-link>
            <template v-else>
              <button
                @click="processMenuCommand(menu.command)"
                :class="mnuClass"
              >
                {{ translate(menu.label) }}
              </button>
            </template>
          </div>
        </div>
        <div
          v-if="userMenuConfig.footer"
          class="flex justify-end p-2 bg-white dark:bg-slate-600 rounded-b-lg"
        >
          <button @click="toggleToolbar()" :class="btnClass">
            <span class="hover:fill-gray-400 fill-primary-400">
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path
                  d="M192 160C245 160 288 202.1 288 256C288 309 245 352 192 352C138.1 352 96 309 96 256C96 202.1 138.1 160 192 160z"
                ></path>
                <path
                  class="opacity-40"
                  d="M384 64C490 64 576 149.1 576 256C576 362 490 448 384 448H192C85.96 448 0 362 0 256C0 149.1 85.96 64 192 64H384zM64 256C64 326.7 121.3 384 192 384H384C454.7 384 512 326.7 512 256C512 185.3 454.7 128 384 128H192C121.3 128 64 185.3 64 256z"
                ></path>
              </svg>
            </span>
          </button>
          <button @click="toggleDarkMode()" :class="btnClass">
            <span class="hover:fill-gray-400 fill-primary-400">
              <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M332.3 426.4c-93.13 17.75-178.5-53.63-178.5-147.6c0-54.25 29-104 76-130.9c7.375-4.125 5.45-15.12-2.8-16.62C108.7 109.4 0 200 0 320c0 106 85.76 192 191.8 192c59.25 0 113.2-26.79 148.9-71.04C346.1 434.5 340.3 424.8 332.3 426.4z"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  class="opacity-40"
                  d="M288 63.1l12.42 29.78c.6094 1.225 2.211 2.219 3.578 2.219s2.967-.9941 3.576-2.219l12.42-29.78l29.79-12.42C351 50.97 352 49.36 352 47.1c0-1.365-.9922-2.967-2.211-3.576l-29.79-12.42l-12.42-29.79c-.6094-1.227-2.209-2.217-3.576-2.217s-2.969 .9902-3.578 2.217l-12.42 29.79L258.2 44.42c-1.217 .6094-2.209 2.211-2.209 3.576c0 1.359 .9922 2.971 2.209 3.58L288 63.1zM507.6 216.9L448 192l-24.88-59.63C421.8 129.8 419 127.1 416 127.1s-5.75 1.75-7.125 4.375L384 192l-59.63 24.88C321.8 218.3 320 221 320 224s1.75 5.75 4.375 7.125L384 256l24.88 59.63C410.3 318.3 413 320 416 320s5.75-1.75 7.125-4.375L448 256l59.63-24.88C510.3 229.8 512 227 512 224S510.3 218.3 507.6 216.9z"
                ></path>
              </svg>
            </span>
          </button>
          <button @click="toggleContentWidth()" :class="btnClass">
            <span class="hover:fill-gray-400 fill-primary-400">
              <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M128 64H32C14.31 64 0 78.31 0 96v96c0 17.69 14.31 32 32 32s32-14.31 32-32V128h64c17.69 0 32-14.31 32-32S145.7 64 128 64zM480 288c-17.69 0-32 14.31-32 32v64h-64c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c17.69 0 32-14.31 32-32v-96C512 302.3 497.7 288 480 288z"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  class="opacity-40"
                  d="M480 64h-96c-17.69 0-32 14.31-32 32s14.31 32 32 32h64v64c0 17.69 14.31 32 32 32s32-14.31 32-32V96C512 78.31 497.7 64 480 64zM128 384H64v-64c0-17.69-14.31-32-32-32s-32 14.31-32 32v96c0 17.69 14.31 32 32 32h96c17.69 0 32-14.31 32-32S145.7 384 128 384z"
                ></path>
              </svg>
            </span>
          </button>
          <button @click="toggleFullscreen()" :class="btnClass">
            <span class="hover:fill-gray-400 fill-primary-400">
              <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M509.5 19.78c-3.242-7.84-9.479-14.08-17.32-17.32C488.3 .8477 484.2 0 480 0h-128c-17.69 0-32 14.31-32 32s14.31 32 32 32h50.75l-113.4 113.4c-12.5 12.5-12.5 32.75 0 45.25c12.49 12.49 32.74 12.51 45.25 0L448 109.3V160c0 17.69 14.31 32 32 32s32-14.31 32-32V32C512 27.84 511.2 23.69 509.5 19.78z"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  class="opacity-40"
                  d="M177.4 289.4L64 402.8V352c0-17.69-14.31-32-32-32s-32 14.31-32 32v128c0 4.164 .8477 8.312 2.465 12.22c3.24 7.832 9.479 14.07 17.31 17.31C23.69 511.2 27.84 512 32 512h128c17.69 0 32-14.31 32-32s-14.31-32-32-32H109.3l113.4-113.4c12.5-12.5 12.5-32.75 0-45.25S189.9 276.9 177.4 289.4z"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import {
  darkMode,
  toggleDarkMode,
  displayToolbar,
  toggleToolbar,
} from "../../../core/helpers/app";
import { translate } from "../../../core/helpers/functions";
import useAppStore from "../../../store/app";

export default defineComponent({
  name: "UserMenu",
  props: {
    btnClass: {
      type: String,
      default:
        "w-8 ml-2 p-2 rounded-lg bg-opacity-40 bg-gray-200 dark:bg-slate-900 hover:bg-gray-200 hover:bg-opacity-60",
    },
    mnuClass: {
      type: String,
      default:
        "w-full text-left hover:bg-gray-50 text-gray-700 dark:text-white block px-4 py-2 text-sm",
    },
  },
  setup() {
    const isFullscreen = ref(false);
    const isFluid = ref(false);
    const isMounted = ref(false);
    const isVisible = ref(false);
    const focusedIndex = ref(0);
    const store = useAppStore();
    const userMenuConfig = useAppStore().getUserMenu;

    /**
     * Toggle app to full screen
     * @returns void
     */
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        isFullscreen.value = true;
        document.documentElement.requestFullscreen();
      } else {
        isFullscreen.value = false;
        document.exitFullscreen();
      }
    };

    /**
     * Change the app locale
     * @param locale
     */
    const changeLocale = (locale) => {
      if (locale) {
        store.setLocale(locale);
      }
    };

    /**
     * Toggle the content width
     * @returns void
     */
    const toggleContentWidth = () => {
      const localStorageConfig = Object.assign(
        {},
        JSON.parse(window.localStorage.getItem("config") || "{}")
      );
      const elements = [
        "topMenu",
        "secondaryMenu",
        "toolbar",
        "content",
        "footer",
      ];

      elements.forEach((id) => {
        const element = document.getElementById("vueadmin-" + id);

        if (element) {
          localStorageConfig[id] = {};
          if (element.classList.contains("container-fluid")) {
            element.classList.add("container");
            element.classList.remove("container-fluid");
            localStorageConfig[id] = Object.assign(
              { width: "fixed" },
              localStorageConfig[id]
            );
            isFluid.value = false;
          } else {
            element.classList.add("container-fluid");
            element.classList.remove("container");
            localStorageConfig[id] = Object.assign(
              { width: "fluid" },
              localStorageConfig[id]
            );
            isFluid.value = true;
          }
        }
      });
      if (localStorageConfig) {
        localStorage.setItem("config", JSON.stringify(localStorageConfig));
      }
    };

    /**
     * Process menu commands
     * @param command
     */
    const processMenuCommand = (command) => {
      hideMenu();
      if (command) {
        command();
      }
    };

    /**
     * Get the current logged in user
     * @returns object
     */
    const getUser = computed(() => {
      return store.getUser;
    });

    /**
     * Hide the menu
     *
     */
    const hideMenu = () => {
      isVisible.value = false;
      focusedIndex.value = 0;
    };

    /**
     * Show the menu
     * @returns void
     */
    const showMenu = () => {
      isVisible.value = true;
    };

    onMounted(async () => {
      isMounted.value = true;
    });

    return {
      changeLocale,
      darkMode,
      displayToolbar,
      focusedIndex,
      getUser,
      hideMenu,
      isFluid,
      isFullscreen,
      isMounted,
      isVisible,
      processMenuCommand,
      showMenu,
      toggleContentWidth,
      toggleDarkMode,
      toggleFullscreen,
      toggleToolbar,
      translate,
      userMenuConfig,
    };
  },
});
</script>
