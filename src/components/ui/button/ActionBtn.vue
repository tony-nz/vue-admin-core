<template>
  <button type="button" :class="btnClass">
    <Duotone
      :icon="icon"
      :ariaLabel="ariaLabel"
      :height="height"
      :width="width"
      v-tooltip="tooltip ? tooltip : ariaLabel"
    />
  </button>
</template>

<script>
import { defineComponent, computed } from "vue";
import Duotone from "../icons/Duotone.vue";

export default defineComponent({
  name: "ActionBtn",
  props: {
    ariaLabel: {
      type: String,
      default: "Icon",
      required: false,
    },
    icon: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      default: "16",
      required: false,
    },
    type: {
      type: String,
      default: "normal",
      required: false,
    },
    tooltip: {
      type: String,
      required: false,
    },
    width: {
      type: String,
      default: "16",
      required: false,
    },
  },
  components: {
    Duotone,
  },
  setup(props) {
    const btnClass = computed(() => {
      const bg =
        props.type === "delete"
          ? "bg-red-100 border-red-800 fill-red-400 dark:bg-red-800 hover:bg-red-400 hover:fill-white"
          : "bg-gray-100 border-gray-800 fill-gray-400 dark:bg-slate-900 hover:bg-primary-400 hover:fill-white";
      return props.class
        ? props.class
        : "transition duration-150 ease-in-out rounded-lg p-2 shadow " + bg;
    });
    return { btnClass };
  },
});
</script>
