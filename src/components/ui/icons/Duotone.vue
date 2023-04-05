<template>
  <div>
    <span class="duotone svg-icon">
      <inline-svg
        id="duotone"
        :src="icon"
        :width="width"
        :height="height"
        :aria-label="ariaLabel"
        :fill="color"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    ariaLabel: {
      type: String,
      default: null,
    },
    classes: {
      type: String,
    },
    color: {
      type: String,
    },
    height: {
      type: String,
      default: "16",
    },
    hover: {
      type: String,
    },
    icon: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "16",
    },
  },
  setup(props) {
    const getColor = computed(() => {
      const element = document.querySelector(".duotone");
      if (element && !props.color) {
        const style = getComputedStyle(element);
        return style.getPropertyValue("fill");
      }
      return props.color;
    });

    return { getColor };
  },
});
</script>

<style>
svg [fill]:not(g) {
  transition: fill 0.3s ease;
  fill: v-bind(getColor);
}
</style>
