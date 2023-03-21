<template>
  <div class="border border-gray-300 border-dashed rounded p-2.5">
    <span class="block flex flex-row gap-2" :class="classTitle">
      <Duotone v-if="icon" :name="icon" :ariaLabel="ariaLabel" />
      {{ title }}
    </span>
    <span class="mt-1 block" :class="classDescription">{{ description }}</span>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import Duotone from "../icons/Duotone.vue";

export default defineComponent({
  name: "StatBox1",
  props: {
    ariaLabel: {
      type: String,
      default: "Icon",
      required: false,
    },
    class: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionClass: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    titleClass: {
      type: String,
      required: false,
    },
  },
  components: {
    Duotone,
  },
  setup(props) {
    const classDescription = computed(() => {
      return props.descriptionClass
        ? props.descriptionClass
        : "text-base text-gray-400";
    });
    const classTitle = computed(() => {
      return props.titleClass ? props.titleClass : "font-bold text-black";
    });
    return { classDescription, classTitle };
  },
});
</script>
