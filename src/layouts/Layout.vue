<template>
  <Toast />
  <div
    id="vueadmin-app"
    class="flex flex-col w-full max-h-full overflow-hidden bg-gray-200 dark:bg-slate-700"
    :style="{ zoom: getZoom }"
  >
    <header class="sticky top-0 z-10">
      <TopMenu
        :tab="activeTab"
        @changeTab="switchTab"
        @openCanvas="showCanvas = true"
        @closeCanvas="showCanvas = false"
      >
        <template v-slot:appBar>
          <AppBar>
            <template v-slot:content>
              <slot name="appBar" />
            </template>
          </AppBar>
        </template>
      </TopMenu>
      <OffCanvas v-model="showCanvas" @close="showCanvas = false" />
      <SecondaryMenu :tab="activeTab" />
    </header>
    <main
      class="relative pb-[50px] flex flex-col flex-1 overflow-auto h-full z-0"
    >
      <div
        id="vueadmin-content"
        :class="{
          'w-full': contentWidth == 'fluid',
          container: contentWidth == 'fixed',
        }"
        class="flex flex-col flex-1 mx-auto overflow-y-auto"
      >
        <router-view v-slot="{ Component, route }">
          <template v-if="route && route.meta && route.meta.isCache">
            <RouterAlive :Component="Component" :viewKey="viewKey" />
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
import { contentWidth, displayToolbar } from "../core/helpers/app";
import { useRoute } from "vue-router";
import AppBar from "./header/AppBar.vue";
import LayoutService from "../core/services/LayoutService";
import OffCanvas from "./offcanvas/OffCanvas.vue";
import RouterAlive from "../components/router-alive/RouterAlive.vue";
import RouterTabs from "./RouterTabs.vue";
import SecondaryMenu from "./header/SecondaryMenu.vue";
import Toast from "primevue/toast";
import TopMenu from "./header/TopMenu.vue";
import useAuthStore from "../store/auth";
import useLayoutStore from "../store/layout";

export default defineComponent({
  name: "VueAdmin",
  components: {
    AppBar,
    OffCanvas,
    RouterAlive,
    RouterTabs,
    SecondaryMenu,
    Toast,
    TopMenu,
  },
  setup() {
    const activeTab = ref(0);
    const authStore = useAuthStore();
    const currentRoute = useRoute();
    const layoutStore = useLayoutStore();
    const showCanvas = ref(false);

    /**
     * Get Zoom
     * @returns {float}
     */
    const getZoom = computed(() => layoutStore.getZoom);

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
      const key = currentRoute.path || Date.now();
      return typeof key === "number" ? key.toString() : key;
    });

    onBeforeMount(() => {
      LayoutService.init();
    });

    return {
      activeTab,
      contentWidth,
      displayToolbar,
      getZoom,
      showCanvas,
      switchTab,
      viewKey,
    };
  },
});
</script>
