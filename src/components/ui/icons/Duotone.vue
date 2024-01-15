<template>
  <div>
    <span v-if="icon" class="duotone svg-icon">
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
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "Duotone",
  components: {
    InlineSvg,
  },
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

<style scoped>
svg [fill]:not(g) {
  transition: fill 0.3s ease;
  fill: v-bind(getColor);
}
</style>
