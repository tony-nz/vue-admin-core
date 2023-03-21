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
          <Duotone
            v-if="!darkMode"
            :name="'moon'"
            height="16"
            width="16"
            ariaLabel="Toggle Dark Mode"
          />
          <Duotone
            v-else
            :name="'sun'"
            height="16"
            width="16"
            ariaLabel="Toggle Dark Mode"
          />
        </button>
        <button
          @click="toggleContentWidth()"
          class="bg-opacity-40 bg-gray-200 hover:bg-gray-200 hover:bg-opacity-60 p-2 rounded-lg"
        >
          <span class="hover:fill-gray-400 fill-blue-400">
            <inline-svg
              v-if="isFluid"
              class="h-4 w-4"
              src="/media/icons/duotone/compress-wide.svg"
            />
            <inline-svg
              v-if="!isFluid"
              class="h-4 w-4"
              src="/media/icons/duotone/expand-wide.svg"
            />
          </span>
        </button>
        <button
          @click="toggleFullscreen()"
          class="bg-opacity-40 bg-gray-200 hover:bg-gray-200 hover:bg-opacity-60 p-2 rounded-lg"
        >
          <span class="hover:fill-gray-400 fill-blue-400">
            <inline-svg
              v-if="isFullscreen"
              class="h-4 w-4"
              src="/media/icons/duotone/down-left-and-up-right-to-center.svg"
            />
            <inline-svg
              v-if="!isFullscreen"
              class="h-4 w-4"
              src="/media/icons/duotone/arrow-up-right-and-arrow-down-left-from-center.svg"
            />
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
      return store.currentUser;
    });
    const getUserAvatar = computed(() => {
      return getUser.value["thumbnailPhotoUrl"]
        ? getUser.value["thumbnailPhotoUrl"]
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
