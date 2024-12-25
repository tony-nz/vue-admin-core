<template>
  <Toast />
  <div
    id="vueadmin-app"
    class="flex flex-col w-full max-h-full overflow-hidden bg-gray-200 dark:bg-slate-700"
  >
    <header class="sticky top-0 z-10">
      <TopMenu :tab="activeTab" @changeTab="switchTab">
        <template v-slot:appBar>
          <AppBar>
            <template v-slot:content>
              <slot name="appBar" />
            </template>
          </AppBar>
        </template>
      </TopMenu>
      <SecondaryMenu :tab="activeTab" />
    </header>
    <main class="relative flex flex-col flex-1 overflow-auto h-full z-0">
      <div
        id="vueadmin-content"
        :class="{
          'container-fluid': contentWidth == 'fluid',
          container: contentWidth == 'fixed',
        }"
        class="flex flex-col flex-1 mx-auto overflow-y-auto"
      >
        <router-view v-slot="{ Component, route }">
          <template v-if="route && route.meta && route.meta.isCache">
            <keep-alive>
              <component :is="Component" :key="viewKey" />
            </keep-alive>
          </template>
          <template v-else>
            <component :is="Component" :key="viewKey" />
          </template>
        </router-view>
      </div>
    </main>
    <footer
      class="w-full p-2 bg-gray-300 dark:bg-slate-900 fixed left-0 bottom-0 flex justify-left items-left shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
    >
      <RouterTabs />
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { contentWidth, displayToolbar } from "../core/helpers/app";
import AppBar from "./header/AppBar.vue";
import TopMenu from "./header/TopMenu.vue";
import SecondaryMenu from "./header/SecondaryMenu.vue";
import LayoutService from "../core/services/LayoutService";
import RouterTabs from "./RouterTabs.vue";
import Toast from "primevue/toast";

export default defineComponent({
  name: "VueAdmin",
  components: {
    AppBar,
    SecondaryMenu,
    RouterTabs,
    Toast,
    TopMenu,
  },
  setup() {
    const activeTab = ref(0);
    const currentRoute = useRoute();

    /**
     * Switch the active tab
     * @param {number} tab
     */
    const switchTab = (tab) => {
      activeTab.value = tab;
    };

    /**
     * Key for the view to force re-render
     * when the route changes
     */
    const viewKey = computed(() => {
      return currentRoute.path || Date.now();
    });

    onBeforeMount(() => {
      LayoutService.init();
    });

    return {
      activeTab,
      contentWidth,
      displayToolbar,
      switchTab,
      viewKey,
    };
  },
});
</script>
