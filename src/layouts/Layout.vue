<template>
  <Toast />
  <div
    id="vueadmin-app"
    class="min-h-full"
    :class="{
      'bg-gray-100': !darkMode,
      'bg-slate-800 dark': darkMode,
    }"
  >
    <Header>
      <slot name="header"></slot>
    </Header>
    <Toolbar
      v-if="displayToolbar"
      :title="pageTitle"
      :breadcrumbs="breadcrumbs"
      :currentPage="currentPage"
    >
      <slot name="toolbar"></slot>
    </Toolbar>
    <main class="relative flex flex-grow pb-16" :class="displayToolbar ? '-mt-16' : ''">
      <div
        id="vueadmin-content"
        :class="{
          'container-fluid': contentWidth == 'fluid',
          container: contentWidth == 'fixed',
        }"
        class="mx-auto py-6 px-6 flex flex-col"
      >
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component
              v-if="route && route.meta && route.meta.isCache"
              :is="Component"
              :key="viewKey"
            />
          </keep-alive>
          <component
            v-if="route && route.meta && !route.meta.isCache"
            :is="Component"
            :key="viewKey"
          />
        </router-view>
      </div>
    </main>
    <footer
      class="w-full p-2 pl-2 bg-gray-300 dark:bg-slate-900 fixed left-0 bottom-0 flex justify-left items-left shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
    >
      <RouterTabs />
    </footer>
    <button
      type="button"
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      class="fixed inline-block p-3 bg-emerald-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-emerald-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-lg transition duration-150 ease-in-out bottom-16 right-2"
    >
      <svg aria-hidden="true" focusable="false" data-prefix="fas" class="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>
    </button>
  </div>
</template>

<script lang="ts">
import { contentWidth, displayLoader, displayToolbar } from "../core/helpers/config";
import { computed, defineComponent, onBeforeMount, onMounted } from "vue";
import { darkMode } from "../core/helpers/config";
import { useLoading } from "vue-loading-overlay";
import { useRoute } from "vue-router";
import Header from "./header/Header.vue";
import LayoutService from "../core/services/LayoutService";
import RouterTabs from "./RouterTabs.vue";
import Toast from "primevue/toast";
import Toolbar from "./toolbar/Toolbar.vue";
import useBreadcrumbStore from "../store/breadcrumb";

export default defineComponent({
  name: "Dashboard",
  components: {
    Header,
    RouterTabs,
    Toast,
    Toolbar,
  },
  setup() {
    const currentRoute = useRoute();
    const loading = useLoading({
      //
    });
    let loader;

    const breadcrumbStore = useBreadcrumbStore();

    const breadcrumbs = computed(() => {
      return breadcrumbStore.pageBreadcrumbPath;
    });
    const currentPage = computed(() => {
      return breadcrumbStore.currentPage;
    });
    const pageTitle = computed(() => {
      return breadcrumbStore.pageTitle;
    });
    const viewKey = computed(() => {
      return currentRoute.path || Date.now();
    });

    onBeforeMount(() => {
      LayoutService.init();
      if (displayLoader) {
        loader = loading.show({
          container: false,
          color: "#00ab00",
          backgroundColor: "#ffffff",
          height: 64,
          width: 64,
          loader: "spinner",
        });
      }
    });

    onMounted(() => {
      if (displayLoader) {
        setTimeout(() => {
          loader.hide();
        }, 1000);
      }
    });

    return {
      breadcrumbs,
      contentWidth,
      currentPage,
      displayToolbar,
      pageTitle,
      viewKey,
      darkMode,
    };
  },
});
</script>
