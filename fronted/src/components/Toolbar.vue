<script setup>
defineProps({
  search: String,
  fontFamily: String,
  filter: String,
  order: String,
  theme: String
});

defineEmits([
  "update:search",
  "update:fontFamily",
  "update:filter",
  "update:order",
  "update:theme"
]);
</script>

<template>
  <div class="toolbar">

    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      placeholder="Buscar texto o fecha..."
    />

    <br><br>

    <select
      :value="fontFamily"
      @change="$emit('update:fontFamily', $event.target.value)"
    >
      <option value="Arial">Arial</option>
      <option value="Verdana">Verdana</option>
      <option value="Georgia">Georgia</option>
      <option value="Courier New">Courier New</option>
      <option value="cursive">Cursive</option>
      <option value="monospace">Monospace</option>
    </select>

    <br><br>

    <select
  :value="filter"
  @change="$emit('update:filter', $event.target.value)"
>
  <option value="all">Todos</option>
  <option value="favorite">Favoritos ⭐</option>
  <option value="recent">Recientes</option>
  <option value="week">Semana pasada</option>
</select>

    <select
      :value="order"
      @change="$emit('update:order', $event.target.value)"
    >
      <option value="desc">Más nuevos</option>
      <option value="asc">Más viejos</option>
    </select>

    <select
      :value="theme"
      @change="$emit('update:theme', $event.target.value)"
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="sakura">Sakura</option>
      <option value="stone-ocean">Stone Ocean</option>
    </select>

  </div>
</template>