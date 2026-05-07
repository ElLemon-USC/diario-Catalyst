<script setup>
import { ref, onMounted } from "vue";

import AuthView from "./views/Auth.vue";
import DiaryForm from "./views/diaryForm.vue"; // respeta minúscula
import Landing from "./views/Landing.vue";
import "./assets/themes/themes.css";
import "./assets/themes/light.css";

const token = sessionStorage.getItem("token");
const showLanding = ref(true);

onMounted(() => {
  const updateView = () => {
    showLanding.value = window.location.hash !== "#auth";
  };

  updateView();

  window.addEventListener("hashchange", updateView);
});

</script>

<template>
  <Landing v-if="!token && showLanding" />

  <AuthView v-else-if="!token" />

  <DiaryForm v-else />
</template>