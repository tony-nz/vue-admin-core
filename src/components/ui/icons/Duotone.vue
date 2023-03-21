<template>
  <div>
    <span class="duotone svg-icon">
      <inline-svg
        id="duotone"
        :src="source"
        :width="getWidth"
        :height="getHeight"
        :aria-label="ariaLabel"
        :fill="color"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

const iconPath = "/media/icons/duotone/";

export default defineComponent({
  props: {
    color: {
      type: String,
    },
    hover: {
      type: String,
    },
    classes: {
      type: String,
    },
    width: {
      type: String,
      default: "16",
    },
    height: {
      type: String,
      default: "16",
    },
    name: {
      type: String,
      required: true,
    },
    ariaLabel: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const source = iconPath + props.name + ".svg";

    const getHeight = computed(() => {
      return props.height;
    });

    const getWidth = computed(() => {
      return props.width;
    });

    const getColor = computed(() => {
      const element = document.querySelector(".duotone");
      if (element && !props.color) {
        const style = getComputedStyle(element);
        return style.getPropertyValue("fill");
      }
      return props.color;
    });

    return {
      getHeight,
      getWidth,
      source,
      getColor,
    };
  },
});
</script>

<style>
svg [fill]:not(g) {
  transition: fill 0.3s ease;
  fill: v-bind(getColor);
}
</style>
