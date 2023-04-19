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
          @updateData="updateData"
          @validated="validated"
          :allowedFields="allowedFields"
          :data="modalData"
          :fetchData="fetchData"
          :form="fields"
          :type="'form'"
          :submit="submit"
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
          :label="type === 'create' ? 'Create' : 'Update'"
          icon="pi pi-check"
          class="btn bg-primary-500"
          @click="onSubmit"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, watch, ref } from "vue";
import ApiService from "../../../core/services/ApiService";
import useConfigStore from "../../../store/config";
import useResourceStore from "../../../store/resource";

export default defineComponent({
  name: "CreateUpdateDialog",
  methods: {
    close() {
      this.$emit("close");
    },
    onSubmit() {
      this.submit = true;
    },
    updateData(data) {
      this.modalData = data;
    },
    validated(valid, data = null) {
      this.modalData = data;
      if (valid) {
        if (this.dataValues) {
          // add dataValues to modalData
          this.modalData = { ...this.modalData, ...this.dataValues };
        }
        if (this.modalType == "create") {
          this.$emit("create", this.modalData, this.dataId, this.subId);
        } else if (this.modalType == "update") {
          this.$emit("update", this.modalData, this.dataId, this.subId);
        }
        this.$emit("close");
      }
      this.submit = false;
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
    const modalData = ref();
    const modalType = ref(props.type);
    const showModal = ref(false);
    const submit = ref(false);
    const resource = ref();

    function fetchData(params) {
      const configStore = useConfigStore();
      const resources = configStore.getResources;

      console.log(params);
      console.log(resources);
      if (params.resourceName) {
        try {
          for (const [key, value] of Object.entries(resources)) {
            if (value.name == params.resourceName) {
              resource.value = value;
            }
          }
          const resourceStore = useResourceStore(resource.value)();
          return resourceStore.getList().then(({ data }) => {
            if (typeof data == "undefined") {
              return null;
            }
            return data;
          });
        } catch (e) {
          // TODO ERROR LOG
          console.log(e);
        }
      }
      return ApiService.get(params.url).then((res) => {
        // state.value.options[fieldId] = res.data.data;
        return res.data.data;
      });
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
      modalData,
      modalType,
      showModal,
      submit,
    };
  },
});
</script>
