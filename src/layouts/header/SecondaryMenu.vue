<template>
  <!-- SecondaryMenu starts -->
  <div
    class="w-full mx-auto bg-white dark:bg-slate-800 shadow relative z-10 hidden lg:flex shadow-md"
  >
    <div
      id="vueadmin-secondaryMenu"
      :class="{
        'container-fluid': layoutWidth == 'fluid',
        container: layoutWidth == 'fixed',
      }"
      class="justify-between px-6 py-6 h-14 flex items-center lg:items-stretch mx-auto"
    >
      <div class="flex items-center">
        <TabPanels v-model="activeTab">
          <template v-for="(menu, i) in mainMenuConfig" :key="i">
            <TabPanel v-if="menu.items">
              <Menubar :model="menu.items">
                <template #item="{ item }">
                  <router-link
                    v-if="!item.divider"
                    :to="item.to ? item.to : ''"
                    custom
                    v-slot="{
                      href,
                      navigate,
                      isActive,
                      isExactActive,
                    }"
                  >
                    <button
                      v-if="item.label && item.to && item.items"
                      :class="[
                        {
                          'bg-red-200 bg-opacity-70 text-blue-300': checkRoute(
                            item.to
                          ),
                          'bg-red-400': isActive,
                          'bg-red-500': isExactActive,
                        },
                        routeClass,
                      ]"
                    >
                      {{ translate(item.label) }}
                    </button>
                    <a
                      v-else
                      :href="href"
                      @click="navigate"
                      :class="[
                        {
                          'bg-slate-200 bg-opacity-70 dark:bg-slate-700 dark:text-white dark:hover:text-slate-300 text-slate-800': checkRoute(
                            item.to
                          ),
                          'bg-gray-200 dark:bg-slate-700': isActive && !item.items,
                          'bg-gray-200 ':
                            isExactActive && item.items && checkChild(item),
                        },
                        'hover:bg-slate-200 hover:bg-opacity-70 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-white shadow-none rounded-lg px-3 py-2 mr-2',
                      ]"
                    >
                      {{ translate(item.label) }}
                    </a>
                  </router-link>
                </template>
              </Menubar>
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
import { layoutWidth } from "../../core/helpers/config";
import { translate } from "../../core/helpers/functions";
import TabPanels from "../../components/ui/tabs/TabPanels.vue";
import TabPanel from "../../components/ui/tabs/TabPanel.vue";
import useConfigStore from "../../store/config";
import MainMenu from "../../core/types/MainMenuTypes";
import useAuthStore from "../../store/auth";

export default defineComponent({
  name: "SecondaryMenu",
  props: ["tab"],
  components: {
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
    const mainMenuConfig: Array<MainMenu> = useConfigStore().getMainMenu;
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

    const store = useAuthStore();
    return {
      store,
      activeTab,
      checkChild,
      checkRoute,
      mainMenuConfig,
      routeClass,
      layoutWidth,
      translate,
    };
  },
});
</script>
