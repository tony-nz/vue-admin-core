<template>
  <div>
    <div class="relative" @mouseover="showMenu" @mouseleave="hideMenu">
      <button
        @focus="showMenu"
        type="button"
        class="flex text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white w-10"
        id="userMenuBtn"
        x-ref="button"
        aria-haspopup="true"
        aria-controls="userMenu"
      >
        <span class="sr-only">Open user menu</span>
        <button
          class="fill-white hover:bg-white hover:fill-slate-400 dark:hover:bg-slate-800 rounded-lg p-1"
        >
          <Duotone
            name="layout-4-blocks"
            height="24"
            width="24"
            ariaLabel="View"
          />
        </button>
      </button>

      <div class="absolute w-full">&nbsp;</div>
      <transition name="mega-menu-fade">
        <div
          v-show="isVisible"
          class="mega-menu absolute normal-case font-normal bg-white shadow-md rounded-lg overflow-hidden border w-160 z-20 right-0"
        >
          <div class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4 pb-0">
            <ul class="w-full grid grid-cols-2 gap-4 px-4">
              <template
                v-for="(item, index) in userAppsConfig.grid"
                :key="index"
              >
                <li class="mb-8">
                  <router-link
                    v-if="item.to"
                    @click="hideMenu"
                    @keydown.esc.exact="hideMenu"
                    :to="item.to"
                    class="flex group"
                  >
                    <div
                      v-if="item.icon"
                      :class="item.icon['bg']"
                      class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12"
                    >
                      <Duotone
                        :name="item.icon['name']"
                        :class="item.icon['fill']"
                        aria-hidden="true"
                      />
                    </div>
                    <span class="ml-2">
                      <span
                        class="block font-bold text-blue-800 group-hover:text-blue-800 flex items-center"
                      >
                        <span>{{ item.label }}</span>
                      </span>
                      <span
                        class="block text-sm text-gray-600 group-hover:text-blue-800"
                        >{{ item.description }}</span
                      >
                    </span>
                  </router-link>
                </li>
              </template>
            </ul>
          </div>
          <ul class="bg-gray-100 px-8 py-8">
            <li
              v-for="(item, index) in userAppsConfig.list"
              :key="index"
              :class="{ 'mt-4': index > 0 }"
            >
              <router-link :to="item.to" class="flex lg:items-center group">
                <div
                  class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-md text-white"
                >
                  <Duotone
                    v-if="item.icon"
                    :name="item.icon['name']"
                    class="fill-gray-400"
                    aria-hidden="true"
                  />
                </div>

                <span class="flex flex-col lg:flex-row lg:items-center">
                  <span
                    class="block ml-2 font-bold text-blue-800 group-hover:text-blue-800"
                    >{{ item.label }}</span
                  >
                  <span
                    class="block ml-2 lg:ml-4 text-sm text-gray-600 group-hover:text-blue-800"
                    >{{ item.description }}</span
                  >
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import Duotone from "../../../components/ui/icons/Duotone.vue";
import useAuthStore from "../../../store/auth";
import useConfigStore from "../../../store/config";
import UserMenuApp from "../../../core/types/UserAppsMenuTypes";
export default defineComponent({
  name: "UserApps",
  components: {
    Duotone,
  },
  setup() {
    const userAppsConfig: UserMenuApp = useConfigStore().getAppMenu;
    const focusedIndex = ref(0);
    const isVisible = ref(false);
    const menuItems: any = ref([]);

    const hideMenu = () => {
      isVisible.value = false;
      focusedIndex.value = 0;
    };
    const showMenu = () => {
      isVisible.value = true;
    };
    const contextMenu = ref();
    const store = useAuthStore();
    const currentUser = ref();
    const toggle = (event) => {
      contextMenu.value.toggle(event);
    };

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

    onMounted(async () => {
      try {
        currentUser.value = await store.getUser;
      } catch (e) {
        console.log(e);
      }
    });

    return {
      focusedIndex,
      isVisible,
      menuItems,
      hideMenu,
      showMenu,
      changeLocale,
      currentUser,
      userAppsConfig,
      contextMenu,
      toggle,
      toggleContentWidth,
      toggleFullscreen,
      isFullscreen,
      isFluid,
      processMenuCommand,
      getLocale,
    };
  },
});
</script>

<style>
/* messy hack to fix userMenu, waiting for reply from PrimeVue */
#appsMenu {
  position: fixed;
  display: block !important;
  top: 53px !important;
  right: 0px !important;
}
#appsMenu ul {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  display: grid;
  gap: 1rem;
}
</style>
