<template>
  <div
    class="absolute inset-0 bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10"
  >
    <div
      class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"
    />

    <h2 class="mt-8 w-full text-center text-gray-600">Loading content...</h2>
    <p class="w-full text-center text-gray-400">
      This may take a few seconds, please don't close this page.
    </p>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Loading",
});
</script>

<style>
.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
