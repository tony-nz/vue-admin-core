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
        <div class="z-30 pr-32 lg:hidden items-center h-full w-full">
          <OffCanvas />
        </div>
        <ul class="pr-32 hidden lg:flex lg:grow items-center h-full">
          <div v-if="displayLogo">
            <img
              :src="darkMode ? logoDark : logoLight"
              :class="logoClass"
              :alt="logoAlt"
            />
          </div>
          <Tabs v-model="activeTab">
            <template v-for="(item, i) in mainMenuConfig" :key="i">
              <Tab
                v-if="item"
                :class="[
                  'top-menu-item cursor-pointer flex items-center text-sm font-medium tracking-normal rounded-t-lg px-4 py-3 rounded-tl-lg rounded-tr-lg overflow-hidden ml-1',
                  !item.items ? 'ml-1.5 my-1 py-2 px-2.5 rounded-lg' : '',
                ]"
                :activeClass="'bg-white dark:bg-slate-800 dark:text-white text-slate-800 menu-active'"
                :inActiveClass="'bg-black bg-opacity-10 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-opacity-100 hover:text-slate-800 text-white text-opacity-70'"
                :isRoute="item.items ? false : true"
                @click="tabClick(item)"
              >
                <span
                  v-if="item.icon && item.icon['path']"
                  class="svg-icon svg-icon-2x svg-icon-white mr-2"
                >
                  <inline-svg :src="item.icon['path']" class="h-6 w-6" />
                </span>
                {{ translate(item.label) }}
              </Tab>
            </template>
          </Tabs>
        </ul>
        <AppBar />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  darkMode,
  displayLogo,
  logoAlt,
  logoClass,
  logoDark,
  logoLight,
  layoutWidth,
} from "../../core/helpers/config";
import { translate } from "../../core/helpers/functions";
import OffCanvas from "../offcanvas/OffCanvas.vue";
import Tabs from "../../components/ui/tabs/Tabs.vue";
import Tab from "../../components/ui/tabs/Tab.vue";
import AppBar from "./AppBar.vue";
import useConfigStore from "../../store/config";
import MainMenu from "../../core/types/MainMenuTypes";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "TopMenu",
  props: ["tab"],
  methods: {
    changeTab(tab) {
      this.$emit("switchTabs", tab);
    },
  },
  components: {
    OffCanvas,
    Tabs,
    Tab,
    AppBar,
  },
  watch: {
    activeTab(tab) {
      this.$emit("changeTab", tab);
    },
  },
  setup(props) {
    const activeTab = ref(props.tab);
    const mainMenuConfig: Array<MainMenu> = useConfigStore().getMainMenu;
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

    return {
      activeTab,
      changeBackground,
      darkMode,
      displayLogo,
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
