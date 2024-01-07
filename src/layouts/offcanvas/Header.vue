<template>
  <div class="bg-white shadow">
    <div class="sm:hidden lg:block px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div
        class="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <img
              class="hidden h-16 w-16 rounded-full sm:block"
              :src="getUserAvatar"
              :alt="getUserName"
            />
            <div>
              <div class="flex items-center">
                <img
                  class="h-16 w-16 rounded-full sm:hidden"
                  :src="getUserAvatar"
                  :alt="getUserName"
                />
                <h1
                  class="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                >
                  Good {{ getTimeOfDay }}, {{ getUserName }}
                </h1>
              </div>
              <dl
                class="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap"
              >
                <dt class="sr-only">Email</dt>
                <dd
                  class="flex items-center text-sm text-gray-500 font-medium sm:mr-6"
                >
                  {{ getUserEmail }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import useAuthStore from "../../store/auth";

export default defineComponent({
  name: "Header",
  setup() {
    const store = useAuthStore();

    const getTimeOfDay = computed(() => {
      const hour = new Date().getHours();
      if (hour < 12) {
        return "morning";
      } else if (hour < 18) {
        return "afternoon";
      } else {
        return "evening";
      }
    });

    const getUser = computed(() => {
      return store.getUser;
    });
    const getUserAvatar = computed(() => {
      return getUser.value["avatar"]
        ? getUser.value["avatar"]
        : "data:image/svg+xml;charset=UTF-8;base64," +
          window.btoa(`
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
              <path class="opacity-40" d="M352 128c0 70.69-57.3 128-128 128C153.3 256 96 198.7 96 128s57.31-128 128-128C294.7 0 352 57.31 352 128z"></path>
            </svg>
          `);
    });

    const getUserEmail = computed(() => {
      return getUser.value["email"]
        ? getUser.value["email"]
        : "Missing email";
    });

    const getUserName = computed(() => {
      return getUser.value["name"]
        ? getUser.value["name"]
        : "Missing name";
    });

    return {
      getTimeOfDay,
      getUser,
      getUserAvatar,
      getUserEmail,
      getUserName,
    };
  },
});
</script>
