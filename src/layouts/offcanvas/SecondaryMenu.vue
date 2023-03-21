<template>
  <div class="grid w-72 px-5 py-5 sm:w-64 w-60 bg-white dark:bg-gray-800">
    <nav class="space-y-6 truncate">
      <VaTabPanels v-model="activeTab">
        <template v-for="(menu, i) in mainMenuConfig" :key="i">
          <VaTabPanel>
            <div class="space-y-3">
              <div v-for="(item, index) in menu.items" :key="index">
                <label
                  v-if="item.divider"
                  class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400"
                  >{{ translate(item.label) }}</label
                >
                <router-link
                  v-else
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
                    v-if="item.to && item.items"
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
                    class="truncate"
                  >
                    {{ translate(item.label) }}
                  </button>
                  <button
                    v-else
                    :href="href"
                    @click="navigate"
                    :class="[
                      {
                        'bg-gray-200 bg-opacity-70 text-blue-300': checkRoute(
                          item.to
                        ),
                        'bg-gray-200': isActive && !item.items,
                        'bg-gray-200 ':
                          isExactActive && item.items && checkChild(item),
                      },
                      routeClass,
                    ]"
                    class="truncate"
                  >
                    {{ translate(item.label) }}
                  </button>
                  <div v-if="item.items">
                    <ul id="dropdown-example" class="py-2 space-y-2">
                      <li
                        v-for="(childMenu, childIndex) in item.items"
                        :key="childIndex"
                        class="truncate"
                      >
                        <router-link
                          :to="childMenu.to"
                          custom
                          v-slot="{
                            href,
                            navigate,
                          }"
                        >
                          <button
                            @click="navigate"
                            :href="href"
                            class="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8 truncate"
                          >
                            {{ translate(childMenu.label) }}
                          </button>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </router-link>
              </div>
            </div>
          </VaTabPanel>
        </template>
      </VaTabPanels>
    </nav>
    <div class="w-56 self-end">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white">
          Projects
        </h2>

        <button
          class="p-0.5 hover:bg-gray-100 duration-200 transition-colors text-gray-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 border rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      <nav class="mt-4 -mx-3 space-y-3">
        <button
          class="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
        >
          <div class="flex items-center gap-x-2">
            <span class="w-2 h-2 bg-pink-500 rounded-full"></span>
            <span>Support</span>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 rtl:rotate-180"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { translate } from "../../core/helpers/functions";
import useConfigStore from "../../store/config";
import MainMenu from "../../core/types/MainMenuTypes";

export default defineComponent({
  name: "SecondaryMenu",
  props: ["tab"],
  watch: {
    tab(value) {
      this.activeTab = value;
    },
  },
  emits: ["closeOffCanvas"],
  setup(props, { emit }) {
    const activeTab = ref(props.tab);
    const mainMenuConfig: Array<MainMenu> = useConfigStore().getMainMenu;
    const routeActiveClass = ref("text-blue-600");
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

    return {
      activeTab,
      checkChild,
      checkRoute,
      mainMenuConfig,
      routeActiveClass,
      routeClass,
      translate,
    };
  },
});
</script>
