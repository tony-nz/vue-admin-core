<template>
  <div
    @click="isVisible = !isVisible"
    class="z-20 lg:hidden absolute"
  >
    <svg
      class="w-6 h-6"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      stroke="white"
      viewBox="0 0 24 24"
    >
      <path
        v-if="!isVisible"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
      <path
        v-else
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
  </div>
  <transition
    enter-from-class="-translate-y-[150%] opacity-0"
    enter-active-class="transition duration-700"
  >
    <div
      v-if="isVisible"
      class="fixed top-0 left-0 z-10 bg-primary-500 dark:bg-slate-900 w-full h-full"
      tabindex="-1"
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
      data-te-offcanvas-init
    >
      <aside class="flex h-full pt-[52px]">
        <TopMenu :tab="activeTab" @changeTab="switchTab" />
        <SecondaryMenu :tab="activeTab" @closeOffCanvas="close" />
        <div class="w-full bg-emerald-600 md:block">
          <Header />
          <Content />
        </div>
      </aside>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { translate } from "../../core/helpers/functions";
import Content from "./Content.vue";
import Header from "./Header.vue";
import TopMenu from "./TopMenu.vue";
import SecondaryMenu from "./SecondaryMenu.vue";

export default defineComponent({
  name: "OffCanvas",
  components: {
    Content,
    Header,
    SecondaryMenu,
    TopMenu,
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const activeTab = ref(0);
    const isVisible = ref(props.show);

    const close = () => {
      isVisible.value = false;
    };

    const open = () => {
      isVisible.value = true;
    };

    onBeforeRouteUpdate((to, from, next) => {
      close();
      next();
    });

    return {
      activeTab,
      close,
      isVisible,
      translate,
    };
  },
});
</script>
