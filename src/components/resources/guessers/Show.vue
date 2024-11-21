<template>
  <VaCard v-if="isMounted" :key="viewKey">
    <template v-slot:toolbar>
      <Button
        :label="translate('va.actions.save')"
        @click="submit = true"
        :class="{ 'opacity-50': submit }"
        :disabled="submit"
      />
    </template>
    <VueFormGenerator
      @updateData="updateData"
      @validated="validated"
      :data="modalData"
      :fetchData="fetchData"
      :form="resource.fields"
      :type="'form'"
      :submit="submit"
    />
  </VaCard>
</template>

<script>
import { defineComponent, onActivated, onMounted, ref } from "vue";
import { translate } from "../../../core/helpers/functions";
import { useRoute } from "vue-router";
import ApiService from "../../../core/services/ApiService";
import useAppStore from "../../../store/app";
import useResourceStore from "../../../store/resource";

export default defineComponent({
  name: "ShowGuesser",
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const dataValues = ref();
    const isMounted = ref(false);
    const modalData = ref();
    const route = useRoute();
    const store = useResourceStore(props.resource)();
    const submit = ref(false);
    const viewKey = ref(0);

    /**
     * fetchData
     * @param {object} params
     */
    function fetchData(params) {
      const appStore = useAppStore();
      const resources = appStore.getResources;

      if (params.resourceName) {
        try {
          for (const [key, value] of Object.entries(resources)) {
            if (value.name == params.resourceName) {
              return useResourceStore(value)()
                .getList({})
                .then(({ data }) => {
                  if (typeof data == "undefined") {
                    return null;
                  }
                  return data;
                });
            }
          }
          return null;
        } catch (e) {
          appStore.showToast({
            severity: "error",
            summary: "Error",
            message: e.message ? e.message : "An error occurred",
          });
        }
      }
      return ApiService.get(params.url).then((res) => {
        return res.data.data;
      });
    }

    /**
     * updateData
     * @param {object} data
     */
    const updateData = (data) => {
      modalData.value = data;
    };

    /**
     * validated
     * @param {boolean} valid
     * @param {object} data
     */
    const validated = (valid, data = null) => {
      modalData.value = data;
      if (valid) {
        if (dataValues.value) {
          // add dataValues to modalData
          modalData.value = { ...modalData.value, ...dataValues.value };
        }
        store.update(
          {},
          {
            params: modalData.value,
            routeId: route.params.id,
          }
        );
      }
      submit.value = false;
    };

    onActivated(() => {
      viewKey.value += 1;
      modalData.value = store.getItem;
    });

    onMounted(() => {
      modalData.value = store.getItem;
      isMounted.value = true;
    });

    return {
      dataValues,
      fetchData,
      isMounted,
      modalData,
      submit,
      translate,
      updateData,
      validated,
      viewKey,
    };
  },
});
</script>
