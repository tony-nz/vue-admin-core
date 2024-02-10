<template>
  <div>
    <Sidebar v-model:visible="localValue" position="right">
      <div class="m-0">
        <VueFormGenerator
          @updateData="updateData"
          @validated="validated"
          :allowedFields="allowedFields"
          :data="data"
          :fetchData="fetchData"
          :form="fields"
          :type="'form'"
          :submit="submit"
        />
        {{ modalData }}
        {{ data }}
      </div>
    </Sidebar>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "CreateUpdateSideBar",
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
    stateList: {
      type: String,
      default: "",
    },
    stateUser: {
      type: Boolean,
      default: false,
    },
    subId: {
      type: Number,
      default: null,
    },
    value: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const dataId = ref();
    const dataValues = ref();
    const modalData = ref();
    const modalType = ref(props.type);
    const showModal = ref(false);
    const submit = ref(false);
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
    /**
     * Local value for sidebar
     * @type {Ref<boolean>}
     */
    const localValue = computed({
      get() {
        return props.value;
      },
      set(value) {
        emit("close");
      },
    });

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
      localValue,
      modalData,
      modalType,
      showModal,
      submit,
    };
  },
});
</script>
