<template>
  <!-- 
    clearCss is an array of classes that will be removed from the card.
    The classes that you can remove are: card, header, title, description, content & footer
    For example: ['content', 'footer']

    menuItems is an array of objects that will be used to create a dropdown menu.
    Each object must have a label and an action. For example:
    {
      label: 'Menu Item',
      action: () => {
        console.log('Menu item clicked');
      }
    }

    classes is an object that can be used to add custom classes to the card.
    The classes that you can add are: card, header, title, description, content & footer
    For example:
    {
      card: ['bg-red-500'],
      header: ['bg-blue-500'],
      title: ['text-white'],
      description: ['text-white'],
      content: ['bg-gray-200'],
      footer: ['bg-gray-200'],
    }
   -->
  <Card
    :classes="{ header: ['mt-0'] }"
    :clearCss="['footer_disabled']"
    :isLoading="isLoading"
    :menuItems="menuItems"
    title="Card Title"
    description="Card description"
  >
    <template v-slot:header_left>
      <button class="px-2 py-1 bg-emerald-400 text-white rounded-md">
        Button
      </button>
    </template>
    <template v-slot:header_right>
      <button class="px-2 py-1 bg-emerald-400 text-white rounded-md">
        Button
      </button>
    </template>

    <template v-slot:content>
      <p>Card content goes here.</p>
    </template>

    <template v-slot:footer_left>
      <p>Left</p>
    </template>

    <template v-slot:footer_middle>
      <p>Middle</p>
    </template>

    <template v-slot:footer_right>
      <p>Right</p>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Card from "./Card.vue";

export default defineComponent({
  name: "CardExample",
  components: {
    Card,
  },
  setup() {
    const isLoading = ref(false);
    const menuItems = [
      {
        label: "Edit",
        action: () => {
          console.log("Clicked!");
        },
      },
      {
        label: "Delete",
        action: () => {
          console.log("Clicked!");
        },
      },
    ];

    onMounted(() => {
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
      }, 4000);
    });

    return {
      isLoading,
      menuItems,
    };
  },
});
</script>
