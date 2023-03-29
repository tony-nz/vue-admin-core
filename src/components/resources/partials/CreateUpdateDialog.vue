<template>
  <div>
    <Dialog
      :header="type == 'create' ? 'Create' : 'Update'"
      v-model:visible="showModal"
      :modal="true"
      :maximizable="true"
      :breakpoints="{ '1280px': '75vw' }"
      :style="{ width: '50vw' }"
      :closeOnEscape="true"
      @hide="close"
    >
      <div class="m-0">
        <VueFormGenerator
          @onChange="updateData"
          @updateData="updateData"
          @validated="validated"
          :allowedFields="allowedFields"
          :data="modalData"
          :fetchData="fetchData"
          :form="fields"
          :type="'form'"
        />
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="close"
          class="p-button-text"
        />
        <Button
          v-if="type == 'create'"
          label="Create"
          icon="pi pi-check"
          class="btn bg-primary-500"
          @click="onCreate"
          autofocus
        />
        <Button
          v-else
          label="Update"
          icon="pi pi-check"
          class="btn bg-primary-500"
          @click="onUpdate"
          autofocus
        />
        <!-- <Button
          v-else
          label="Update"
          icon="pi pi-check"
          class="btn bg-primary-500"
          @click="isValid = true"
          autofocus
        /> -->
      </template>
    </Dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "CreateUpdateDialog",
  methods: {
    updateData(data) {
      this.modalData = data;
    },
    onCreate() {
      if (this.dataValues) {
        // add dataValues to modalData
        this.modalData = { ...this.modalData, ...this.dataValues };
      }
      this.$emit("create", this.modalData, this.subId);
      this.$emit("close");
    },
    onUpdate() {
      if (this.dataValues) {
        // add dataValues to modalData
        this.modalData = { ...this.modalData, ...this.dataValues };
      }
      this.$emit("update", this.modalData, this.dataId, this.subId);
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
    validated(valid) {
      if (valid) {
        if (this.modalType == "create") {
          this.$emit("create", this.modalData, this.dataId, this.subId);
        } else if (this.modalType == "update") {
          this.$emit("update", this.modalData, this.dataId, this.subId);
        }
        this.$emit("close");
      }
      this.isValid = false;
    },
  },
  props: {
    allowedFields: {
      type: Array,
      required: false,
    },
    data: {
      type: Object,
      required: true,
    },
    fields: {
      type: Object,
      required: true,
    },
    fieldFilters: {
      type: Object,
      required: false,
    },
    fieldValues: {
      type: Object,
      required: false,
    },
    type: {
      type: String,
    },
    primaryKey: {
      type: String,
      default: "id",
    },
    resource: {
      type: Object,
      required: true,
    },
    subId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const dataId = ref();
    const dataValues = ref();
    const isValid = ref(false);
    const modalData = ref();
    const modalType = ref(props.type);
    const showModal = ref(false);
    const resource = ref();

    function fetchData(params) {
      // if (params.resourceName) {
      //   try {
      //     for (const [key, value] of Object.entries(resources)) {
      //       if (value.resource.name == params.resourceName) {
      //         resource.value = value.resource;
      //       }
      //     }
      //     const resourceStore = useResourceStore(resource.value)();
      //     return resourceStore.getList().then(({ data }) => {
      //       if (typeof data == "undefined") {
      //         return null;
      //       }
      //       return data;
      //     });
      //   } catch (e) {
      //     // TODO ERROR LOG
      //     console.log(e);
      //   }
      // }
      // return ApiService.get(params.url).then((res) => {
      //   // state.value.options[fieldId] = res.data.data;
      //   return res.data.data;
      // });
    }

    onMounted(() => {
      dataId.value = props.data[props.primaryKey];
      dataValues.value = props.fieldValues;
      modalData.value = props.data;
      showModal.value = true;
    });

    return {
      dataId,
      dataValues,
      fetchData,
      isValid,
      modalData,
      modalType,
      showModal,
    };
  },
});
</script>
