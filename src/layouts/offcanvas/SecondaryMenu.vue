<template>
  <div class="grid w-72 px-5 py-5 sm:w-64 w-60 bg-white dark:bg-gray-800">
    <nav class="space-y-6 truncate">
      <VaTabPanels v-model="activeTab">
        <template v-for="(menu, i) in mainMenuConfig" :key="i">
          <VaTabPanel>
            <div class="flex flex-col text-left space-y-3">
              <template v-for="(item, index) in menu.items" :key="index">
                <label
                  v-if="item.divider"
                  class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400"
                  >{{ translate(item.label) }}</label
                >
                <router-link
                  v-else
                  :to="item.to ? item.to : ''"
                  custom
                  v-slot="{ href, navigate, isActive, isExactActive }"
                >
                  <button
                    v-if="item.to && item.items"
                    :class="[
                      {
                        'bg-red-200 bg-opacity-70 text-primary-500': checkRoute(
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
                    @click="
                      (event) => {
                        navigate();
                        emitCloseOffCanvas(event);
                      }
                    "
                    :class="[
                      {
                        'bg-gray-200 bg-opacity-70 text-primary-500 dark:text-white dark:bg-opacity-10':
                          checkRoute(item.to),
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
                  <template v-if="item.items">
                    <ul class="py-2 space-y-2">
                      <li
                        v-for="(childMenu, childIndex) in item.items"
                        :key="childIndex"
                        class="truncate"
                      >
                        <router-link
                          :to="childMenu.to"
                          custom
                          v-slot="{ href, navigate }"
                        >
                          <button
                            @click="
                              (event) => {
                                navigate();
                                emitCloseOffCanvas(event);
                              }
                            "
                            :href="href"
                            class="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-8 truncate"
                          >
                            {{ translate(childMenu.label) }}
                          </button>
                        </router-link>
                      </li>
                    </ul>
                  </template>
                </router-link>
              </template>
            </div>
          </VaTabPanel>
        </template>
      </VaTabPanels>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { translate } from "../../core/helpers/functions";
import useLayoutStore from "../../store/layout";
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
    const mainMenuConfig: Array<MainMenu> = useLayoutStore().getMainMenu;
    const routeActiveClass = ref("text-primary-500");
    const routeClass = ref(
      "text-left hover:text-primary-500 shadow-none rounded-lg px-3 py-2 mr-2 dark:text-white"
    );

    /**
     * Check if the child route is active
     * @param item
     */
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
     * Check if the route is active
     * @param to
     */
    const checkRoute = (to) => {
      if (window.location.href.indexOf(to) > -1) {
        return true;
      }
      return false;
    };

    /**
     * Emit close off canvas event
     * @param event
     */
    const emitCloseOffCanvas = (event: Event) => {
      // Prevent default action if it's a link click
      if (event.target instanceof HTMLAnchorElement) {
        event.preventDefault();
      }
      emit("closeOffCanvas");
    };

    return {
      activeTab,
      checkChild,
      checkRoute,
      emitCloseOffCanvas,
      mainMenuConfig,
      routeActiveClass,
      routeClass,
      translate,
    };
  },
});
</script>
