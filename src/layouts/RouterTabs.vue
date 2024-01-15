<template>
  <div class="hidden lg:flex lg:flex-nowrap lg:overflow-x-auto">
    <div
      v-for="(item, index) in tabs"
      :key="item.name"
      :class="{ active: currentRouteName === item.name }"
      @contextmenu.prevent="(e) => handleOpenContext(e, item, index)"
      class="flex mr-2 text-gray-500 bg-white hover:bg-primary-500 hover:text-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-400"
    >
      <router-link
        :to="{
          name: item.name,
          params: item.params,
          query: item.query,
        }"
        v-slot="{ isExactActive }"
        class="whitespace-nowrap"
      >
        <div
          :class="{
            'bg-gray-400 text-white rounded-l-lg': isExactActive,
          }"
          class="flex p-2 text-sm"
        >
          <span
            v-if="item.icon && item.icon['path']"
            class="mr-2"
          >
            <inline-svg :src="item.icon['path']" class="h-4 w-4" />
          </span>
          {{ item.title }}
        </div>
      </router-link>
      <button
        @click="handleClose(item, index)"
        class="p-2 bg-gray-200 hover:bg-red-500 rounded-r-lg"
      >
        <svg class="fill-black hover:fill-white w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
        </svg>
      </button>
    </div>
    <div
      class="flex absolute right-0 justify-between mr-2 text-gray-500 bg-white hover:bg-gray-400 hover:text-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-400"
    >
      <button
        @click="handleCloseAll()"
        class="p-3 bg-gray-200 hover:bg-red-500 rounded-lg"
      >
        <svg class="fill-black hover:fill-white w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
        </svg>
      </button>
    </div>
    <div
      v-if="contentVisible"
      id="dropdownDivider"
      class="fixed z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
      :style="{
        left: `${positionContext.left}px`,
        top: `${positionContext.top}px`,
      }"
    >
      <div class="py-2">
        <a
          @click="handleClose(tabs[currentContextIndex], currentContextIndex)"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >Close</a
        >

        <!-- <li @click="handleCloseOther">handleCloseOther</li> -->
        <!-- <li @click="handleCloseAll">handleCloseAll</li> -->
      </div>
    </div>
  </div>
  <div class="lg:hidden w-full">
    <select v-on:change="changeRoute" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
      <option
        v-for="(item, index) in tabs"
        :key="item.name"
        class="flex flex-wrap text-sm font-medium text-center"
      >
        {{ item.title }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref, reactive } from "vue";
import { useTabsStore, ITabsItem } from "../store/tabs";
import { useRoute, useRouter } from "vue-router";
import Duotone from "../components/ui/icons/Duotone.vue";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "RouterTabs",
  components: {
    Duotone,
    InlineSvg,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useTabsStore();
    const tabs = computed(() => {
      return store.tabs;
    });
    const positionContext = reactive({
      left: 0,
      top: 0,
    });
    watch(
      () => route.name,
      () => {
        const index = tabs.value.findIndex((item) => {
          return item.name === route.name;
        });
        index < 0 && store.handleAddRoute(route);
      },
      {
        immediate: true,
      }
    );
    const currentRouteName = computed(() => {
      return route.name;
    });
    const handleCloseOther = () => {
      if (
        currentRouteName.value !== tabs.value[currentContextIndex.value].name
      ) {
        router.push({
          name: tabs.value[currentContextIndex.value].name,
          query: tabs.value[currentContextIndex.value].query,
          params: tabs.value[currentContextIndex.value].params,
        });
      }
      store.handleCloseOther(currentContextIndex.value);
    };
    const handleCloseAll = () => {
      router.push({
        name: "home",
      });
      store.handleCloseAll();
    };
    const handleClose = (item: ITabsItem, index: number) => {
      store.handleClose(index);
      const isCurrentRoute = item.name === currentRouteName.value;
      isCurrentRoute &&
        router.push({
          name: tabs.value[tabs.value.length - 1].name,
          query: tabs.value[tabs.value.length - 1].query,
          params: tabs.value[tabs.value.length - 1].params,
        });
    };
    const contentVisible = ref(false);
    const currentContextIndex = ref(0);
    const handleOpenContext = (e: any, item: ITabsItem, index: number) => {
      console.log(e);
      currentContextIndex.value = index;
      contentVisible.value = true;
      positionContext.left = e.x;
      positionContext.top = e.y - 50;
    };

    watch(contentVisible, (val: boolean) => {
      const _fn = () => {
        contentVisible.value = false;
      };
      if (val) {
        window.addEventListener("click", _fn);
      } else {
        window.removeEventListener("click", _fn);
      }
    });
    const changeRoute = (e: any) => {
      const index = e.target.selectedIndex;
      router.push({
        name: tabs.value[index].name,
        query: tabs.value[index].query,
        params: tabs.value[index].params,
      });
    };
    return {
      changeRoute,
      tabs,
      currentRouteName,
      handleClose,
      handleOpenContext,
      positionContext,
      contentVisible,
      currentContextIndex,
      handleCloseOther,
      handleCloseAll,
    };
  },
});
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  width: 100px;
  left: 0;
  top: 0;
  background: #fff;
  z-index: 2;
  text-align: center;
  border: 1px solid #606266;
  border-bottom: none;
  padding: 0;
  li {
    height: 30px;
    cursor: pointer;
    line-height: 30px;
    border-bottom: 1px solid #606266;
    list-style: none;
  }
}
</style>
