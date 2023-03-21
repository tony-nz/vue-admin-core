<template>
  <!-- TopMenu starts -->
  <nav
    class="w-full mx-auto dark:bg-slate-900 relative z-20"
    :class="slugBackground ? slugBackground : 'bg-primary-500'"
  >
    <div
      id="vueadmin-topMenu"
      :class="{
        'container-fluid': topMenuWidthFluid == 'fluid',
        container: topMenuWidthFluid == 'fixed',
      }"
      class="px-6 pt-2 flex items-center lg:items-stretch mx-auto min-h-[52px]"
    >
      <div class="flex w-full content-end">
        <div class="z-20 pr-32 lg:hidden items-center h-full w-full">
          <OffCanvas />
        </div>
        <ul class="pr-32 hidden lg:flex lg:grow items-center h-full">
          <Tabs v-model="activeTab">
            <template v-for="(item, i) in mainMenuConfig" :key="i">
              <Tab
                v-if="item"
                :class="'top-menu-item cursor-pointer flex items-center text-sm font-medium tracking-normal rounded-t-lg px-4 py-3 rounded-tl-lg rounded-tr-lg overflow-hidden ml-1'"
                :activeClass="'bg-white dark:bg-slate-800 dark:text-white text-slate-800 menu-active'"
                :inActiveClass="'bg-black bg-opacity-10 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-opacity-100 hover:text-slate-800 text-white text-opacity-70'"
                @click="changeBackground(item)"
              >
                <span
                  v-if="item.icon && item.icon['svg']"
                  class="svg-icon svg-icon-2x svg-icon-white mr-2"
                >
                  <inline-svg :src="item.icon['svg']" class="h-6 w-6" />
                </span>
                <i
                  v-else-if="item.icon && item.icon['name']"
                  :class="'text-green-600 mr-2 fa-sm ' + item.icon['name']"
                ></i>
                {{ translate(item.label) }}
              </Tab>
            </template>
          </Tabs>
        </ul>
        <AppBar />
      </div>
    </div>
  </nav>
  <!-- TopMenu ends -->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { topMenuWidthFluid } from "../../core/helpers/config";
import { translate } from "../../core/helpers/functions";
import OffCanvas from "../offcanvas/OffCanvas.vue";
import Tabs from "../../components/ui/tabs/Tabs.vue";
import Tab from "../../components/ui/tabs/Tab.vue";
import AppBar from "./AppBar.vue";
import useConfigStore from "../../store/config";
import MainMenu from "../../core/types/MainMenuTypes";

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
    const slugBackground = ref();

    const changeBackground = (menuItem) => {
      // if (menuItem.slug) {
      slugBackground.value = menuItem.backgroundColor;
      // }
    };

    return {
      activeTab,
      changeBackground,
      mainMenuConfig,
      slugBackground,
      topMenuWidthFluid,
      translate,
    };
  },
});
</script>
