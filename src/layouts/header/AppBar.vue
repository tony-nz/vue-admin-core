<template>
  <div
    class="flex z-20 -mt-[9px] items-center grow justify-end"
  >
    <div class="mr-2">
      <button
        @click="toggleDarkMode()"
        class="fill-white hover:bg-white hover:fill-slate-400 dark:hover:bg-slate-800 hover:bg-opacity-20 rounded-lg p-2"
      >
        <Duotone
          v-if="!darkMode"
          :name="'moon'"
          height="20"
          width="20"
          ariaLabel="Toggle Dark Mode"
        />
        <Duotone
          v-else
          :name="'sun'"
          height="20"
          width="20"
          ariaLabel="Toggle Dark Mode"
        />
      </button>
    </div>
    <UserApps />
    <UserMenu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { darkMode, toggleDarkMode } from "../../core/helpers/config";
import Duotone from "../../components/ui/icons/Duotone.vue";
import UserApps from "./partials/UserApps.vue";
import UserMenu from "./partials/UserMenu.vue";

export default defineComponent({
  name: "AppBar",
  components: {
    Duotone,
    UserApps,
    UserMenu,
  },
  setup() {
    return {
      darkMode,
      toggleDarkMode,
    };
  },
});
</script>
