<script setup>
import { computed, ref, watch } from "vue";
import "../assets/reader.css";

const props = defineProps({
  entry: Object,
  decodeText: Function
});

const emit = defineEmits(["close"]);

const page = ref(1);
const charsPerPage = 350;

const fullText = computed(() =>
  props.decodeText(props.entry.content)
);

const pages = computed(() => {
  const arr = [];

  for (let i = 0; i < fullText.value.length; i += charsPerPage) {
    arr.push(fullText.value.slice(i, i + charsPerPage));
  }

  return arr;
});

watch(() => props.entry, () => {
  page.value = 1;
});

const nextPage = () => {
  if (page.value < pages.value.length) page.value++;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};
</script>

<template>
  <div class="overlay">

    <div class="reader-box">

      <h2>Modo Lectura</h2>

      <p :style="{ fontFamily: entry.fontFamily || 'Arial' }">
        {{ pages[page - 1] }}
      </p>

      <small>
        Página {{ page }} / {{ pages.length }}
      </small>

      <br><br>

      <button @click="prevPage">⬅</button>
      <button @click="nextPage">➡</button>
      <button @click="emit('close')">Cerrar</button>

    </div>

  </div>
</template>

