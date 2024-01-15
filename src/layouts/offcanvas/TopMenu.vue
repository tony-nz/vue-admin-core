<template>
  <div
    class="flex flex-col items-center max-w-[60px] min-w-[60px] py-4 bg-emerald-500 dark:bg-gray-900 dark:border-gray-700"
  >
    <nav class="flex flex-col items-center flex-1 space-y-4">
      <VaTabs
        v-model="activeTab"
        :childClass="'flex flex-col items-center flex-1 space-y-4'"
      >
        <template v-for="(item, i) in mainMenuConfig" :key="i">
          <VaTab
            :class="'p-1.5 inline-block focus:outline-nones transition-colors duration-200 rounded-lg dark:fill-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 hover:fill-gray-500'"
            :activeClass="'bg-white dark:bg-slate-600 dark:fill-white fill-gray-800 menu-active'"
            :inActiveClass="'bg-black bg-opacity-10 hover:bg-white hover:bg-opacity-100 hover:fill-gray-800 fill-white fill-opacity-70'"
            @click="changeBackground(item)"
          >
            <inline-svg v-if="item.svgIcon" :src="item.svgIcon" class="h-6 w-6" />
          </VaTab>
        </template>
      </VaTabs>
      <a
        href="#"
        class="p-1.5 inline-block text-white focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 hover:text-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </a>

      <a
        href="#"
        class="p-1.5 inline-block text-white transition-colors duration-200 bg-emerald-600 rounded-lg dark:text-blue-400 dark:bg-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      </a>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import InlineSvg from "vue-inline-svg";
import MainMenu from "../../core/types/MainMenuTypes";
import useConfigStore from "../../store/config";

export default defineComponent({
  name: "TopMenu",
  components: {
    InlineSvg,
  },
  props: ["tab"],
  methods: {
    changeTab(tab) {
      this.$emit("switchTabs", tab);
    },
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
      slugBackground,
      mainMenuConfig,
    };
  },
});
</script>
