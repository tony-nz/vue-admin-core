<template>
  <VaCard v-if="isMounted">
    <VueFormGenerator
      @updateData="updateData"
      @validated="validated"
      :data="data"
      :fetchData="fetchData"
      :form="resource.fields"
      :type="'form'"
      :submit="submit"
    />
  </VaCard>
</template>

<script>
import { defineComponent, onMounted, watch, ref } from "vue";
import ApiService from "../../../core/services/ApiService";
import useConfigStore from "../../../store/config";
import useResourceStore from "../../../store/resource";

export default defineComponent({
  name: "Show",
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
    resource: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const dataId = ref();
    const dataValues = ref();
    const modalData = ref();
    const modalType = ref(props.type);
    const showModal = ref(false);
    const submit = ref(false);
    const data = ref();
    const isMounted = ref(false);

    function fetchData(params) {
      const configStore = useConfigStore();
      const resources = configStore.getResources;
      
      if (params.resourceName) {
        try {
          for (const [key, value] of Object.entries(resources)) {
            if (value.name == params.resourceName) {
              return useResourceStore(value)().getList({}).then(({ data }) => {
                if (typeof data == "undefined") {
                  return null;
                }
                return data;
              });
            }
          }
          return null;
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
      data.value = useResourceStore(props.resource)().getDataItem;
      isMounted.value = true;
    });

    return {
      dataValues,
      fetchData,
      isMounted,
      modalData,
      modalType,
      showModal,
      submit,
      data,
    };
  },
});
</script>
