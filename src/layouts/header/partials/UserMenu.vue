<template>
  <div v-if="isMounted" class="relative inline-block">
    <button
      @click="isVisible = !isVisible"
      @mouseover="isVisible = true"
      id="userMenuBtn"
      class="flex text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white w-10"
      type="button"
      x-ref="button"
      aria-haspopup="true"
      aria-controls="userMenu"
    >
      <span class="sr-only">Open user menu</span>
      <img class="h-10 w-10 rounded-lg" :src="getUserAvatar" alt="" />
    </button>
    <div
      v-if="isVisible"
      @mouseleave="isVisible = false"
      tabindex="0"
      id="userMenuDropdown"
      x-transition:enter="transition ease-out duration-100"
      x-transition:enter-start="opacity-0 scale-90"
      x-transition:enter-end="opacity-100 scale-100"
      x-transition:leave="transition ease-in duration-100"
      x-transition:leave-start="opacity-100 scale-100"
      x-transition:leave-end="opacity-0 scale-90"
      class="absolute right-0 z-20 w-64 py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800"
    >
      <a href="#" class="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
        <img
          class="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
          :src="getUserAvatar"
          :alt="getUserName"
        />
        <div class="mx-1 truncate">
          <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ getUserName }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ getUserEmail }}</p>
        </div>
      </a>
      <hr class="border-gray-200 dark:border-gray-700" />
      <a href="#" class="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="mx-1">
          View profile
        </span>
      </a>
      <a href="#" class="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="mx-1">
          Settings
        </span>
      </a>
      <hr class="border-gray-200 dark:border-gray-700" />
      <a href="#" class="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="mx-1">
          Help
        </span>
      </a>
      <a href="#" class="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="mx-1">
          Sign Out
        </span>
      </a>
      <div class="ml-auto mr-2 w-20 grid grid-cols-3 gap-10 place-items-end">
        <button
          @click="toggleDarkMode()"
          class="bg-opacity-40 bg-gray-200 hover:bg-gray-200 hover:bg-opacity-60 p-2 rounded-lg fill-blue-800"
        >
          <svg v-if="!darkMode" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"/>
          </svg>
          <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1z"/>
            <path d="M509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z"/>
          </svg>
        </button>
        <button
          @click="toggleContentWidth()"
          class="bg-opacity-40 bg-gray-200 hover:bg-gray-200 hover:bg-opacity-60 p-2 rounded-lg"
        >
          <span class="hover:fill-gray-400 fill-blue-400">
            <svg v-if="isFluid" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M128 64C110.3 64 96 78.31 96 96v64H32C14.31 160 0 174.3 0 192s14.31 32 32 32h96c17.69 0 32-14.31 32-32V96C160 78.31 145.7 64 128 64zM480 288h-96c-17.69 0-32 14.31-32 32v96c0 17.69 14.31 32 32 32s32-14.31 32-32v-64h64c17.69 0 32-14.31 32-32S497.7 288 480 288z" />
              <path d="M128 288H32c-17.69 0-32 14.31-32 32s14.31 32 32 32h64v64c0 17.69 14.31 32 32 32s32-14.31 32-32v-96C160 302.3 145.7 288 128 288zM480 160h-64V96c0-17.69-14.31-32-32-32s-32 14.31-32 32v96c0 17.69 14.31 32 32 32h96c17.69 0 32-14.31 32-32S497.7 160 480 160z" />
            </svg>
            <svg v-if="!isFluid" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M128 64H32C14.31 64 0 78.31 0 96v96c0 17.69 14.31 32 32 32s32-14.31 32-32V128h64c17.69 0 32-14.31 32-32S145.7 64 128 64zM480 288c-17.69 0-32 14.31-32 32v64h-64c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c17.69 0 32-14.31 32-32v-96C512 302.3 497.7 288 480 288z" />
              <path d="M480 64h-96c-17.69 0-32 14.31-32 32s14.31 32 32 32h64v64c0 17.69 14.31 32 32 32s32-14.31 32-32V96C512 78.31 497.7 64 480 64zM128 384H64v-64c0-17.69-14.31-32-32-32s-32 14.31-32 32v96c0 17.69 14.31 32 32 32h96c17.69 0 32-14.31 32-32S145.7 384 128 384z" />
            </svg>
          </span>
        </button>
        <button
          @click="toggleFullscreen()"
          class="bg-opacity-40 bg-gray-200 hover:bg-gray-200 hover:bg-opacity-60 p-2 rounded-lg"
        >
          <span class="hover:fill-gray-400 fill-blue-400">
            <svg v-if="isFullscreen" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M272 216V80c0-12.94 7.781-24.61 19.75-29.56c12-4.906 25.72-2.203 34.87 6.937l30.06 30.06l78.06-78.07c12.5-12.5 32.76-12.5 45.26 .0003l22.62 22.62c12.5 12.5 12.5 32.76-.0002 45.26l-78.06 78.07l30.06 30.06c9.156 9.156 11.91 22.91 6.938 34.87c-4.938 11.95-16.63 19.75-29.56 19.75h-136C282.7 240 272 229.3 272 216z" />
              <path d="M215.1 272h-136c-12.94 0-24.63 7.797-29.56 19.75C45.47 303.7 48.22 317.5 57.37 326.6l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.75-.0012 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.26 .0013l78.06-78.07l30.06 30.06c6.125 6.125 14.31 9.367 22.63 9.367c4.125 0 8.279-.7891 12.25-2.43c11.97-4.953 19.75-16.62 19.75-29.56V296C239.1 282.7 229.3 272 215.1 272z" />
            </svg>
            <svg v-if="!isFullscreen" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M509.5 19.78c-3.242-7.84-9.479-14.08-17.32-17.32C488.3 .8477 484.2 0 480 0h-128c-17.69 0-32 14.31-32 32s14.31 32 32 32h50.75l-113.4 113.4c-12.5 12.5-12.5 32.75 0 45.25c12.49 12.49 32.74 12.51 45.25 0L448 109.3V160c0 17.69 14.31 32 32 32s32-14.31 32-32V32C512 27.84 511.2 23.69 509.5 19.78z" />
              <path d="M177.4 289.4L64 402.8V352c0-17.69-14.31-32-32-32s-32 14.31-32 32v128c0 4.164 .8477 8.312 2.465 12.22c3.24 7.832 9.479 14.07 17.31 17.31C23.69 511.2 27.84 512 32 512h128c17.69 0 32-14.31 32-32s-14.31-32-32-32H109.3l113.4-113.4c12.5-12.5 12.5-32.75 0-45.25S189.9 276.9 177.4 289.4z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Duotone from "../../../components/ui/icons/Duotone.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { darkMode, toggleDarkMode } from "../../../core/helpers/config";
import { translate } from "../../../core/helpers/functions";
import useAuthStore from "../../../store/auth";
import useConfigStore from "../../../store/config";

export default defineComponent({
  name: "UserMenu",
  components: {
    // TODO change this back to menu
    Duotone,
  },
  setup() {
    const isMounted = ref(false);
    const userMenuConfig = useConfigStore().getUserMenu;
    const contextMenu = ref();
    const store = useAuthStore();

    const toggle = (event) => {
      contextMenu.value.toggle(event);
    };
    const isVisible = ref(false);
    const focusedIndex = ref(0);

    const isFullscreen = ref(false);
    const isFluid = ref(false);

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        isFullscreen.value = true;
        document.documentElement.requestFullscreen();
      } else {
        isFullscreen.value = false;
        document.exitFullscreen();
      }
    };

    const changeLocale = (locale) => {
      if (locale) {
        store.setLocale(locale);
      }
    };

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

    const processMenuCommand = (command) => {
      if (command) {
        command();
      }
      contextMenu.value.hide();
    };

    const getUserLocale2 = computed(() => {
      switch (getUser.value["locale"]) {
        case "en":
          return "English";
        case "maori":
          return "Maori";
        default:
          break;
      }
      return null;
    });
    const getUser = computed(() => {
      return store.getUser;
    });
    const getUserAvatar = computed(() => {
      return getUser.value["avatar"]
        ? getUser.value["avatar"]
        : "/media/icons/duotone/user.svg";
    });

    const getUserEmail = computed(() => {
      return getUser.value["primaryEmail"]
        ? getUser.value["primaryEmail"]
        : "Missing email";
    });

    const getUserName = computed(() => {
      return getUser.value["fullName"]
        ? getUser.value["fullName"]
        : "Missing name";
    });
    const hideMenu = () => {
      isVisible.value = false;
      focusedIndex.value = 0;
    };
    const showMenu = () => {
      isVisible.value = true;
    };


    /**
     * Dropdown menu
     */
    const clickEventType = () => {
      return document.ontouchstart !== null ? "click" : "touchstart";
    };
    
    onMounted(async () => {
      isMounted.value = true;
    });

    return {
      getUserLocale2,
      changeLocale,
      userMenuConfig,
      contextMenu,
      toggle,
      toggleContentWidth,
      toggleFullscreen,
      isFullscreen,
      isFluid,
      processMenuCommand,
      getUserAvatar,
      getUserEmail,
      getUserName,
      toggleDarkMode,
      darkMode,
      store,
      translate,
      isVisible,
      hideMenu,
      showMenu,
      focusedIndex,
      isMounted,
    };
  },
});
</script>

<style>
/* messy hack to fix userMenu, waiting for reply from PrimeVue */
.p-contextmenu {
  position: fixed;
  display: block !important;
  top: 53px !important;
  right: 0px !important;
}
</style>
