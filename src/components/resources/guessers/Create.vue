<template>
  <div>Create</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Create",
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
