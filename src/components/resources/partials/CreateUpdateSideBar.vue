<template>
  <div>
    <Sidebar v-model:visible="localValue" position="right">
      <div class="m-0">
        <VueFormGenerator
          @updateData="updateData"
          @validated="validated"
          :allowedFields="allowedFields"
          :data="sideBarData"
          :fetchData="fetchData"
          :form="fields"
          :type="'tabs'"
        />
      </div>
    </Sidebar>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "CreateUpdateSideBar",
  methods: {
    updateData(data) {
      this.sideBarData = data;
    },
    onCreate() {
      this.$emit("create", this.sideBarData);
      this.$emit("close");
    },
    onUpdate() {
      // TODO reference direct mixin
      this.$emit("update", this.sideBarData, this.dataId);
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
    validated(valid) {
      if (valid) {
        if (this.modalType == "create") {
          this.$emit("create", this.sideBarData, this.dataId);
        } else if (this.modalType == "update") {
          this.$emit("update", this.sideBarData, this.dataId);
        }
        this.$emit("close");
      }
      this.isValid = false;
    },
  },
  props: {
    value: {
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    fields: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
    },
    primaryKey: {
      type: String,
      default: "id",
    },
  },
  setup(props, { emit }) {
    const showSideBar = ref(false);
    const isValid = ref(false);
    const sideBarData = ref();
    const modalType = ref(props.type);
    const dataId = ref();
    const localValue = computed({
      get() {
        return props.value;
      },
      set(value) {
        emit("close");
      },
    });
    onMounted(() => {
      sideBarData.value = props.data;
      dataId.value = props.data[props.primaryKey];
      showSideBar.value = true;
    });
    return {
      showSideBar,
      sideBarData,
      modalType,
      dataId,
      isValid,
      localValue,
    };
  },
});
</script>
