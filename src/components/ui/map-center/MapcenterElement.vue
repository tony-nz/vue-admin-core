<template>
  <component :is="elementLayout" :multiple="true" ref="container">
    <template #element>
      <div :class="classes.wrapper" role="group" :aria-labelledby="labelId">
        <div :style="{ height: '300px', width: '100%' }" ref="mapElement"></div>
      </div>
    </template>
  </component>
</template>

<script>
import { onMounted, ref } from "vue";
import { classes } from "@vueform/vueform/dist/tailwind";
import { ObjectElement } from "@vueform/vueform";

export default {
  ...ObjectElement,
  name: "MapcenterElement",
  setup(props, context) {
    const element = ObjectElement.setup(props, context);
    const mapElement = ref(null);
    let map = null;
    let marker = null;

    const loadMap = () => {
      map = new window.google.maps.Map(mapElement.value, {
        center: { lat: 0, lng: 0 }, // Default center, adjust based on user location or preference
        zoom: 2,
      });

      window.google.maps.event.addListener(map, "click", (event) => {
        placeMarker(event.latLng);
      });
    };

    const placeMarker = (location) => {
      // Remove previous marker if it exists
      if (marker) {
        marker.setMap(null);
      }
      // Create a new marker at the clicked location
      marker = new window.google.maps.Marker({
        position: location,
        map: map,
        draggable: true,
      });

      // Update the map center to the marker's position
      map.setCenter(location);

      // Update form model with the new center coordinates
      element.model.value = { lat: location.lat(), lng: location.lng() };
    };

    onMounted(() => {
      // Ensure Google Maps API is loaded before initializing the map
      if (window.google && window.google.maps) {
        loadMap();
      } else {
        // Here we could implement a retry mechanism or show an error message
        console.error("Google Maps API not loaded");
      }
    });

    const defaultClasses = ref({
      ...classes.ObjectElement,
    });

    return {
      mapElement,
      defaultClasses,
      ...element,
    };
  },
};
</script>
