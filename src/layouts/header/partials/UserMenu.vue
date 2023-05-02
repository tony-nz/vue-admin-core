<template>
  <div v-if="isMounted" class="relative inline-block">
    <button @click="toggle" type="button"
      class="flex text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white w-10"
      id="userMenuBtn" x-ref="button" aria-haspopup="true" aria-controls="userMenu">
      <span class="sr-only">Open user menu</span>
      <button class="fill-white hover:bg-white hover:fill-emerald-300 dark:hover:bg-slate-800 rounded-lg p-2">
        <img v-if="getUser['avatar']" class="h-10 w-10 rounded-lg" :src="getUser['avatar']" :alt="getUser['name']" />
        <span v-else>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" />
            <path class="opacity-40" d="M352 128c0 70.69-57.3 128-128 128C153.3 256 96 198.7 96 128s57.31-128 128-128C294.7 0 352 57.31 352 128z" />
          </svg>
        </span>
      </button>
    </button>
    <ContextMenu id="userMenu" ref="contextMenu" :model="userMenuConfig" :autoZIndex="true" class="p-0 w-72">
      <template #item="{ item }">
        <div v-if="item.header" class="flex-shrink-0 flex p-2 rounded-t bg-slate-100 border-b-2 border-emerald-500">
          <div class="flex items-center">
            <div>
              <img class="w-12 h-12 rounded-full ring-offset-2 ring-2 ring-emerald-500" :src="getUserAvatar" alt="" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {{ getUserName }}
              </p>
              <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                {{ getUserEmail }}
              </p>
            </div>
          </div>
        </div>
        <router-link v-if="item.to" :to="item.to" custom v-slot="{ navigate, isActive, isExactActive }">
          <button @click="processMenuCommand(navigate)"
            class="flex p-4 py-3 overflow-hidden text-sm font-medium text-gray-700 group-hover:text-gray-900 hover:bg-gray-100 hover:bg-opacity-50 hover:text-blue-500 "
            :class="{
              'active-link': isActive,
              'active-link-exact': isExactActive,
            }">
            {{ translate(item.label) }}
          </button>
        </router-link>
        <button v-else-if="item.label" @click="processMenuCommand(item.command)"
          class="hover:bg-gray-100 hover:bg-opacity-50 hover:text-blue-500 w-full hover:rounded-lg items-center overflow-hidden flex p-4 py-3">
          {{ translate(item.label) }}
          <div v-if="item.label == 'Language'" class="py-1 px-2 bg-gray-200 rounded ml-auto mr-2 text-xs">
            {{ getUserLocale }}
          </div>
          <span v-if="item.items" :class="{ 'p-menuitem-language': item.label == 'Language' }"
            class="p-submenu-icon pi pi-angle-right"></span>
        </button>
        <div v-if="item.footer" class="flex justify-end p-2">
          <button
            @click="toggleContentWidth()"
            :class="btnClass"
          >
            <span class="hover:fill-gray-400 fill-blue-400">
              <inline-svg v-if="isFullscreen" class="h-4 w-4" src="/media/icons/duotone/brightness.svg" />
              <inline-svg v-if="!isFullscreen" class="h-4 w-4" src="/media/icons/duotone/moon-stars.svg" />
            </span>
          </button>
          <button
            @click="toggleContentWidth()"
            :class="btnClass"
          >
            <span class="hover:fill-gray-400 fill-blue-400">
              <inline-svg v-if="isFluid" class="h-4 w-4" src="/media/icons/duotone/compress-wide.svg" />
              <inline-svg v-if="!isFluid" class="h-4 w-4" src="/media/icons/duotone/expand-wide.svg" />
            </span>
          </button>
          <button
            @click="toggleFullscreen()"
            :class="btnClass"
          >
            <span class="hover:fill-gray-400 fill-blue-400">
              <inline-svg v-if="isFullscreen" class="h-4 w-4"
                src="/media/icons/duotone/down-left-and-up-right-to-center.svg" />
              <inline-svg v-if="!isFullscreen" class="h-4 w-4"
                src="/media/icons/duotone/arrow-up-right-and-arrow-down-left-from-center.svg" />
            </span>
          </button>
        </div>
      </template>
    </ContextMenu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { darkMode, toggleDarkMode } from "../../../core/helpers/config";
import { translate } from "../../../core/helpers/functions";
import useAuthStore from "../../../store/auth";
import useConfigStore from "../../../store/config";


export default defineComponent({
  name: "UserMenu",
  setup() {
    const isMounted = ref(false);
    const userMenuConfig = useConfigStore().getUserMenu;
    const contextMenu = ref();
    const btnClass = ref("w-8 ml-2 p-2 rounded-lg bg-opacity-40 bg-gray-200 hover:bg-gray-200 hover:bg-opacity-60")
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

    const getUserLocale = computed(() => {
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
      return getUser.value["email"]
        ? getUser.value["email"]
        : "Missing email";
    });

    const getUserName = computed(() => {
      return getUser.value["name"]
        ? getUser.value["name"]
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
      getUserLocale,
      changeLocale,
      userMenuConfig,
      contextMenu,
      toggle,
      toggleContentWidth,
      toggleFullscreen,
      isFullscreen,
      isFluid,
      processMenuCommand,
      getUser,
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
      btnClass,
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
