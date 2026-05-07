<script setup>
defineProps({
  title: String
});

defineEmits(["logout"]);
</script>

<template>
  <div class="container">

    <button class="logout" @click="$emit('logout')">
      Logout
    </button>

    <h1>{{ title }}</h1>

    <slot />

  </div>
</template>