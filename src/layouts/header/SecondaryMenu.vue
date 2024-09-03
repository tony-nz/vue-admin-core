<template>
  <!-- SecondaryMenu starts -->
  <div
    v-if="hasChild"
    class="w-full mx-auto bg-white dark:bg-slate-800 shadow relative z-10 hidden lg:flex shadow-md"
  >
    <div
      id="vueadmin-secondaryMenu"
      :class="{
        'container-fluid': layoutWidth == 'fluid',
        container: layoutWidth == 'fixed',
      }"
      class="justify-between px-4 py-6 h-14 flex items-center lg:items-stretch mx-auto"
    >
      <div class="flex items-center">
        <!-- go back button -->
        <button
          @click="goBack"
          class="transition duration-150 ease-in-out btn bg-primary-500 border-gray-800 rounded-lg fill-gray-400 disabled:hover:fill-gray-400 hover:bg-primary-600 disabled:hover:bg-gray-100 dark:bg-slate-800 hover:fill-white p-2 shadow mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              class="fill-none"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11"
            />
          </svg>
        </button>
        <TabPanels v-model="activeTab">
          <template v-for="(menu, i) in mainMenuConfig" :key="i">
            <TabPanel v-if="menu.items">
              <nav class="flex-row hidden md:pb-0 md:flex md:justify-end">
                <template v-for="item in menu.items" :key="item.to">
                  <router-link
                    v-if="item && !item.items && !item.external && item.to"
                    v-slot="{ isActive, isExactActive, navigate }"
                    :to="item.to"
                    custom
                  >
                    <button
                      @click="navigate"
                      :class="[defaultClass, isExactActive && activeClass]"
                    >
                      <div
                        class="flex flex-row items-center justify-center dark:text-slate-800"
                      >
                        <div v-if="item.icon" class="mr-2">
                          <inline-svg :src="item.icon" class="h-4 w-4" />
                        </div>
                        {{ translate(item.label) }}
                      </div>
                    </button>
                  </router-link>
                  <a
                    v-if="item.external"
                    :href="item.to"
                    target="_blank"
                    :class="defaultClass"
                  >
                    <div
                      class="flex flex-row items-center justify-center dark:text-white"
                    >
                      <div
                        v-if="item.icon"
                        :class="{ 'mr-2': item.label.length > 0 }"
                      >
                        <inline-svg :src="item.icon" class="h-4 w-4" />
                      </div>
                      {{ translate(item.label) }}
                    </div>
                  </a>
                  <div v-if="item.items" class="relative md:mr-4">
                    <DropdownMenu :activeClass="activeClass" :item="item" />
                  </div>
                </template>
              </nav>
            </TabPanel>
          </template>
        </TabPanels>
      </div>
    </div>
  </div>
  <!-- SecondaryMenu ends -->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { layoutWidth } from "../../core/helpers/app";
import { translate } from "../../core/helpers/functions";
import type { MainMenu } from "../../core/types/MainMenuTypes";
import { goBack } from "../../core/helpers/functions";

import DropdownMenu from "./partials/DropdownMenu.vue";
import InlineSvg from "vue-inline-svg";
import TabPanels from "../../components/ui/tabs/TabPanels.vue";
import TabPanel from "../../components/ui/tabs/TabPanel.vue";
import useAppStore from "../../store/app";

export default defineComponent({
  name: "SecondaryMenu",
  props: ["tab"],
  components: {
    DropdownMenu,
    InlineSvg,
    TabPanels,
    TabPanel,
  },
  watch: {
    tab(value) {
      this.activeTab = value;
    },
  },
  setup(props) {
    const activeTab = ref(props.tab);
    const mainMenuConfig: MainMenu[] = useAppStore().getMainMenu;
    const routeClass = ref(
      "hover:text-blue-600 shadow-none rounded-lg px-3 py-2 mr-2"
    );
    const checkRoute = (to) => {
      if (window.location.href.indexOf(to) > -1) {
        return true;
      }
      return false;
    };

    // loop through all the child items and check if any of them is active
    const checkChild = (item) => {
      let active = false;
      item.items.forEach((child) => {
        if (window.location.href.indexOf(child.to) > -1) {
          active = true;
        }
      });
      return active;
    };

    /**
     * Check to see if mainMenuConfig children have them items property
     * @returns boolean
     */
    const hasChild = mainMenuConfig.some((item) => item.items);

    const store = useAppStore();
    const activeClass = ref("text-gray-900 bg-gray-200");
    const defaultClass = ref(
      "px-2 py-2 text-sm rounded-md dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:mr-2 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
    );

    return {
      activeClass,
      defaultClass,
      hasChild,
      store,
      activeTab,
      checkChild,
      checkRoute,
      goBack,
      mainMenuConfig,
      routeClass,
      layoutWidth,
      translate,
    };
  },
});
</script>
<style scoped>
.p-menubar {
  padding: 1rem 0 !important;
  background: none !important;
  border: none !important;
}
</style>
