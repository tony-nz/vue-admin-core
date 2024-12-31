<template>
  <nav
    class="w-full mx-auto dark:bg-slate-900 relative z-30"
    :class="slugBackground ? slugBackground : 'bg-primary-600'"
  >
    <div
      id="vueadmin-topMenu"
      :class="{
        'w-full': layoutWidth == 'fluid',
        container: layoutWidth == 'fixed',
      }"
      class="px-4 pt-2 flex items-center lg:items-stretch mx-auto min-h-[52px]"
    >
      <div class="flex w-full content-end">
        <div
          :class="{ '-mt-[4px]': !hasChild }"
          class="z-30 pr-32 lg:hidden items-center h-full w-full"
        >
          <button
            @click="openCanvas"
            class="relative -top-1 p-1 rounded-lg hover:bg-white/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-6 w-6"
            >
              <path
                class="fill-white"
                d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
              />
            </svg>
          </button>
        </div>
        <ul
          :class="{ '-mt-[4px]': !hasChild }"
          class="pr-32 hidden lg:flex lg:grow items-center h-full"
        >
          <template v-if="displayLogo">
            <img
              :src="darkMode ? logoDark : logoLight"
              :class="logoClass"
              :alt="logoAlt"
            />
          </template>
          <Tabs v-model="activeTab">
            <template v-for="(item, i) in mainMenuConfig" :key="i">
              <Tab
                v-if="item && item.items"
                :class="[
                  'top-menu-item cursor-pointer flex items-center font-medium tracking-normal rounded-t-lg px-4 py-3 rounded-tl-lg rounded-tr-lg overflow-hidden ml-1 group',
                  !item.items ? 'ml-1.5 my-1 py-2 px-2.5 rounded-lg' : '',
                ]"
                :activeClass="'group bg-white dark:bg-slate-800 dark:text-white text-slate-800 menu-active'"
                :inActiveClass="'group bg-black/10 dark:bg-opacity-40 group-hover:bg-primary-800 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-opacity-100 hover:text-slate-800 text-white'"
                :isRoute="item.items ? false : true"
                @click="tabClick(item)"
              >
                <template v-slot:item="{ isActive }">
                  <span v-if="item.icon && item.icon['path']" class="mr-2">
                    <inline-svg
                      :src="item.icon['path']"
                      class="group-hover:fill-primary-600 h-6 w-6"
                      :class="{
                        'fill-white': !isActive,
                        'fill-primary-600': isActive,
                      }"
                    />
                  </span>
                  {{ translate(item.label) }}
                </template>
              </Tab>

              <router-link
                v-else
                custom
                :to="item.to ? item.to : ''"
                v-slot="{ isExactActive, navigate }"
              >
                <button
                  @click="navigate"
                  class="cursor-pointer flex items-center font-medium tracking-normal overflow-hidden ml-1.5 my-1 py-2 px-2.5 rounded-lg group"
                  :class="{
                    'bg-white dark:bg-slate-800 dark:text-white text-slate-800 menu-active':
                      isExactActive,
                    'bg-black/10 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-opacity-100 hover:text-slate-800 text-white text-opacity-70':
                      !isExactActive,
                  }"
                >
                  <span v-if="item.icon && item.icon['path']" class="mr-2">
                    <inline-svg
                      :src="item.icon['path']"
                      class="!fill-current h-6 w-6"
                    />
                  </span>
                  {{ translate(item.label) }}
                </button>
              </router-link>
            </template>
          </Tabs>
        </ul>
        <slot name="appBar" />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  darkMode,
  displayLogo,
  logoAlt,
  logoClass,
  logoDark,
  logoLight,
  layoutWidth,
} from "../../core/helpers/app";
import { translate } from "../../core/helpers/functions";
import { useRouter } from "vue-router";
import type { MainMenu } from "../../core/types/MainMenuTypes";
import OffCanvas from "../offcanvas/OffCanvas.vue";
import InlineSvg from "vue-inline-svg";
import Tabs from "../../components/ui/tabs/Tabs.vue";
import Tab from "../../components/ui/tabs/Tab.vue";
import useLayoutStore from "../../store/layout";

export default defineComponent({
  name: "TopMenu",
  props: ["tab"],
  components: {
    InlineSvg,
    OffCanvas,
    Tabs,
    Tab,
  },
  methods: {
    changeTab(tab) {
      this.$emit("switchTabs", tab);
    },
  },
  watch: {
    activeTab(tab) {
      this.$emit("changeTab", tab);
    },
  },
  setup(props, { emit }) {
    const activeTab = ref(props.tab);
    const mainMenuConfig: Array<MainMenu> = useLayoutStore().getMainMenu;
    const router = useRouter();
    const slugBackground = ref();

    /**
     * Active route
     * @param url
     * @param config
     * @returns number
     */
    const activeRoute = (url, config) => {
      for (let i = 0; i < config.length; i++) {
        const parent = config[i];

        // Check parent URL
        if (parent.to === url) {
          return i;
        }

        // Check children URLs
        if (parent.items) {
          for (let j = 0; j < parent.items.length; j++) {
            if (parent.items[j].to === url) {
              return i;
            }
          }
        }
      }

      return -1; // Return -1 if URL is not found
    };

    /**
     * Change background color
     * @param menuItem
     * @returns void
     */
    const changeBackground = (menuItem) => {
      slugBackground.value = menuItem.backgroundColor;
    };

    /**
     * Check to see if mainMenuConfig children have them items property
     * @returns boolean
     */
    const hasChild = mainMenuConfig.some((item) => item.items);

    /**
     * Open canvas
     * @returns void
     */
    const openCanvas = () => {
      emit("openCanvas");
    };

    /**
     * Tab click
     * @param item
     * @returns void
     */
    const tabClick = (item) => {
      if (!item.items || item.to) {
        router.push({ path: item.to });
      }
      changeBackground(item);
    };

    onMounted(() => {
      const active = activeRoute(
        router.currentRoute.value.path,
        mainMenuConfig
      );
      if (active > -1) {
        activeTab.value = active;
      }
    });

    /**
     * Watch for route changes and update the active tab
     * @param to
     */
    watch(
      () => router.currentRoute.value,
      (to) => {
        const active = activeRoute(to.path, mainMenuConfig);
        if (active > -1) {
          activeTab.value = active;
        }
      }
    );

    return {
      activeTab,
      changeBackground,
      darkMode,
      displayLogo,
      hasChild,
      logoAlt,
      logoClass,
      mainMenuConfig,
      openCanvas,
      slugBackground,
      logoDark,
      logoLight,
      layoutWidth,
      tabClick,
      translate,
    };
  },
});
</script>
