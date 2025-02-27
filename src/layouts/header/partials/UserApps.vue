<template>
  <div>
    <div class="relative" @mouseover="showMenu" @mouseleave="hideMenu">
      <button
        @focus="showMenu"
        type="button"
        class="fill-white hover:bg-white dark:hover:bg-slate-800 hover:bg-opacity-20 rounded-lg p-2"
        id="userMenuBtn"
        x-ref="button"
        aria-haspopup="true"
        aria-controls="userMenu"
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          class="h-5 w-5 rounded-sm"
          viewBox="0 0 35 35"
          xml:space="preserve"
        >
          <g>
            <g>
              <rect width="16" height="16" />
              <rect x="19" width="16" height="16" />
              <rect y="19" width="16" height="16" />
              <rect x="19" y="19" width="16" height="16" />
            </g>
          </g>
        </svg>
      </button>

      <div class="absolute w-full">&nbsp;</div>
      <transition name="mega-menu-fade">
        <div
          v-show="isVisible"
          class="mega-menu absolute normal-case font-normal bg-white dark:bg-slate-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 overflow-hidden w-160 z-30 right-0"
        >
          <div class="flex flex-col lg:flex-row">
            <ul class="w-full grid grid-cols-2">
              <template
                v-for="(item, index) in userAppsConfig.grid"
                :key="index"
              >
                <router-link
                  v-if="item.to"
                  @click="hideMenu"
                  @keydown.esc.exact="hideMenu"
                  :to="item.to"
                  class="flex group p-4 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <div
                    v-if="item.icon && item.icon['path']"
                    :class="item.icon['bg']"
                    class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-gray-200 text-white sm:h-12 sm:w-12"
                  >
                    <Duotone
                      :icon="item.icon['path']"
                      :class="item.icon['fill']"
                      aria-hidden="true"
                    />
                  </div>
                  <span class="ml-2">
                    <span
                      class="block font-bold text-blue-600 group-hover:text-blue-800 dark:group-hover:text-white flex items-center"
                    >
                      <span>{{ translate(item.label) }}</span>
                    </span>
                    <span
                      class="block text-sm text-gray-600 group-hover:text-blue-800 dark:group-hover:text-white"
                      >{{ translate(item.description) }}</span
                    >
                  </span>
                </router-link>
              </template>
            </ul>
          </div>
          <ul class="bg-gray-100 dark:bg-slate-700 rounded-b-md">
            <template v-for="(item, index) in userAppsConfig.list" :key="index">
              <router-link
                v-if="item.to"
                :to="item.to"
                class="flex p-4 hover:bg-gray-200 lg:items-center group dark:hover:bg-slate-800"
              >
                <div
                  class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-md text-white"
                >
                  <Duotone
                    v-if="item.icon"
                    :icon="item.icon['path']"
                    class="fill-gray-400"
                    aria-hidden="true"
                  />
                </div>

                <span class="flex flex-col lg:flex-row lg:items-center">
                  <span
                    class="block ml-2 font-bold text-blue-800 group-hover:text-blue-800 dark:group-hover:text-white"
                    >{{ translate(item.label) }}</span
                  >
                  <span
                    class="block ml-2 lg:ml-4 text-sm text-gray-600 group-hover:text-blue-800 dark:group-hover:text-white"
                    >{{ translate(item.description) }}</span
                  >
                </span>
              </router-link>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { translate } from "../../../core/helpers/functions";
import Duotone from "../../../components/ui/icons/Duotone.vue";
import useAppStore from "../../../store/app";
import useAuthStore from "../../../store/auth";
import useLayoutStore from "../../../store/layout";

export default defineComponent({
  name: "UserApps",
  components: {
    Duotone,
  },
  setup() {
    const contextMenu = ref();
    const currentUser = ref();
    const focusedIndex = ref(0);
    const isFluid = ref(false);
    const isFullscreen = ref(false);
    const isVisible = ref(false);
    const menuItems = ref([]);
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const layoutStore = useLayoutStore();
    const userAppsConfig = layoutStore.getAppMenu;

    /**
     * Change the locale of the current user
     * @param locale
     */
    const changeLocale = (locale) => {
      if (locale) {
        appStore.setLocale(locale);
      }
    };

    /**
     * Get the locale of the current user
     * @returns {string} The locale of the current user
     */
    const getLocale = computed(() => {
      switch (currentUser.value["locale"]) {
        case "en":
          return "English";
        case "maori":
          return "Maori";
        default:
          break;
      }
      return null;
    });

    /**
     * Hide the context menu
     */
    const hideMenu = () => {
      isVisible.value = false;
      focusedIndex.value = 0;
    };

    /**
     * Process the command from the context menu
     * @param command
     */
    const processMenuCommand = (command) => {
      if (command) {
        command();
      }
      contextMenu.value.hide();
    };

    /**
     * Show the context menu
     */
    const showMenu = () => {
      isVisible.value = true;
    };

    /**
     * Toggle the context menu
     * @param event
     */
    const toggle = (event) => {
      contextMenu.value.toggle(event);
    };

    /**
     * Toggle the content width between fixed and fluid
     * @returns {void}
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
          if (element.classList.contains("w-full")) {
            element.classList.add("container");
            element.classList.remove("w-full");
            localStorageConfig[id] = Object.assign(
              { width: "fixed" },
              localStorageConfig[id]
            );
            isFluid.value = false;
          } else {
            element.classList.add("w-full");
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
     * Toggle the fullscreen mode
     * @returns {void}
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

    onMounted(async () => {
      currentUser.value = await authStore.getUser;
    });

    return {
      changeLocale,
      contextMenu,
      currentUser,
      focusedIndex,
      getLocale,
      hideMenu,
      isFluid,
      isFullscreen,
      isVisible,
      menuItems,
      processMenuCommand,
      showMenu,
      toggle,
      toggleContentWidth,
      toggleFullscreen,
      translate,
      userAppsConfig,
    };
  },
});
</script>
