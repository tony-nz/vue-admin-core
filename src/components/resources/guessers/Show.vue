<template>
  <div>Show</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Show",
  props: {
    title: {
      type: String,
    },
    resource: {
      type: Object,
    },
  },
  setup() {
    return {};
  },
});
</script>
