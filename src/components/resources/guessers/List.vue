<template>
  <Card>
    <DataTable :resource="resource">
      <template v-slot:toolbar></template>
    </DataTable>
  </Card>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import Card from "../../ui/card/Card.vue";
import DataTable from "../datatable/AdvDataTable.vue";

export default defineComponent({
  name: "ListGuesser",
  props: {
    name: {
      type: String,
    },
    resource: {
      type: Object,
    },
  },
  components: {
    Card,
    DataTable,
  },
  setup() {
    const isMounted = ref(false);

    onMounted(async () => {
      isMounted.value = true;
    });

    return { isMounted };
  },
});
</script>
