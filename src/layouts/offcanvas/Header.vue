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
      return store.currentUser;
    });
    const getUserAvatar = computed(() => {
      return getUser.value["thumbnailPhotoUrl"]
        ? getUser.value["thumbnailPhotoUrl"]
        : "/media/icons/duotone/user.svg";
    });

    const getUserEmail = computed(() => {
      return getUser.value["primaryEmail"]
        ? getUser.value["primaryEmail"]
        : "Missing email";
    });

    const getUserName = computed(() => {
      return getUser.value["fullName"]
        ? getUser.value["fullName"]
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
