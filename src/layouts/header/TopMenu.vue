<template>
  <nav
    class="w-full mx-auto dark:bg-slate-900 relative z-30"
    :class="slugBackground ? slugBackground : 'bg-primary-500'"
  >
    <div
      id="vueadmin-topMenu"
      :class="{
        'container-fluid': layoutWidth == 'fluid',
        container: layoutWidth == 'fixed',
      }"
      class="px-6 pt-2 flex items-center lg:items-stretch mx-auto min-h-[52px]"
    >
      <div class="flex w-full content-end">
        <div
          :class="{ '-mt-[4px]': !hasChild }"
          class="z-30 pr-32 lg:hidden items-center h-full w-full"
        >
          <OffCanvas />
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
                  'top-menu-item cursor-pointer flex items-center text-sm font-medium tracking-normal rounded-t-lg px-4 py-3 rounded-tl-lg rounded-tr-lg overflow-hidden ml-1 group',
                  !item.items ? 'ml-1.5 my-1 py-2 px-2.5 rounded-lg' : '',
                ]"
                :activeClass="'bg-white dark:bg-slate-800 dark:text-white text-slate-800 menu-active'"
                :inActiveClass="'bg-black bg-opacity-10 group-hover:bg-primary-800 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-opacity-100 hover:text-slate-800 text-white'"
                :isRoute="item.items ? false : true"
                @click="tabClick(item)"
              >
                <span v-if="item.icon && item.icon['path']" class="mr-2">
                  <inline-svg
                    :src="item.icon['path']"
                    class="!fill-current h-6 w-6"
                  />
                </span>
                {{ translate(item.label) }}
              </Tab>

              <router-link
                v-else
                custom
                :to="item.to ? item.to : ''"
                v-slot="{ isExactActive, navigate }"
              >
                <button
                  @click="navigate"
                  class="cursor-pointer flex items-center text-sm font-medium tracking-normal overflow-hidden ml-1.5 my-1 py-2 px-2.5 rounded-lg group"
                  :class="{
                    'bg-white dark:bg-slate-800 dark:text-white text-slate-800 menu-active':
                      isExactActive,
                    'bg-black bg-opacity-10 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-opacity-100 hover:text-slate-800 text-white text-opacity-70':
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
        <AppBar />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
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
import AppBar from "./AppBar.vue";
import OffCanvas from "../offcanvas/OffCanvas.vue";
import InlineSvg from "vue-inline-svg";
import Tabs from "../../components/ui/tabs/Tabs.vue";
import Tab from "../../components/ui/tabs/Tab.vue";
import useAppStore from "../../store/app";

export default defineComponent({
  name: "TopMenu",
  props: ["tab"],
  methods: {
    changeTab(tab) {
      this.$emit("switchTabs", tab);
    },
  },
  components: {
    AppBar,
    InlineSvg,
    OffCanvas,
    Tabs,
    Tab,
  },
  watch: {
    activeTab(tab) {
      this.$emit("changeTab", tab);
    },
  },
  setup(props) {
    const activeTab = ref(props.tab);
    const mainMenuConfig: Array<MainMenu> = useAppStore().getMainMenu;
    const router = useRouter();
    const slugBackground = ref();

    const changeBackground = (menuItem) => {
      // if (menuItem.slug) {
      slugBackground.value = menuItem.backgroundColor;
      // }
    };

    const tabClick = (item) => {
      if (!item.items) {
        router.push({ path: item.to });
      }
      changeBackground(item);
    };

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
     * Check to see if mainMenuConfig children have them items property
     * @returns boolean
     */
    const hasChild = mainMenuConfig.some((item) => item.items);

    onMounted(() => {
      const active = activeRoute(
        router.currentRoute.value.path,
        mainMenuConfig
      );
      if (active > -1) {
        activeTab.value = active;
        // changeBackground(mainMenuConfig[active]);
      }
    });

    return {
      activeTab,
      changeBackground,
      darkMode,
      displayLogo,
      hasChild,
      logoAlt,
      logoClass,
      mainMenuConfig,
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
