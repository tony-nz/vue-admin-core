<template>
  <div
    class="flex flex-col items-center max-w-[60px] min-w-[60px] py-4 bg-primary-500 dark:bg-gray-900 dark:border-gray-700"
  >
    <nav class="flex flex-col items-center flex-1 space-y-4">
      <VaTabs
        v-model="activeTab"
        :childClass="'flex flex-col items-center flex-1 space-y-4'"
      >
        <template v-for="(item, i) in mainMenuConfig" :key="i">
          <VaTab
            :class="'p-1.5 group inline-block focus:outline-nones transition-colors duration-200 rounded-lg dark:fill-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 hover:fill-gray-500 hover:cursor-pointer'"
            :activeClass="'bg-white dark:bg-slate-600 dark:fill-white fill-gray-800 menu-active'"
            :inActiveClass="'bg-black/10 hover:bg-white hover:bg-opacity-100 hover:fill-gray-800 fill-white fill-opacity-70'"
            :isRoute="item.items ? false : true"
            @click="changeBackground(item)"
          >
            <template v-slot:item="{ isActive }">
              <template v-if="item.icon && item.icon['path']">
                <inline-svg
                  :src="item.icon['path']"
                  class="group-hover:fill-primary-600 h-6 w-6"
                  :class="{
                    'fill-white': !isActive,
                    'fill-primary-600': isActive,
                  }"
                />
              </template>
            </template>
          </VaTab>
        </template>
      </VaTabs>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import InlineSvg from "vue-inline-svg";
import MainMenu from "../../core/types/MainMenuTypes";
import useLayoutStore from "../../store/layout";

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
    const mainMenuConfig: Array<MainMenu> = useLayoutStore().getMainMenu;
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
