<script setup>
import DiaryCard from "./DiaryCard.vue";

defineProps({
  entries: Array,
  decodeText: Function,
  formatDate: Function,
  myUserId: String
});

defineEmits(["favorite", "read", "edit", "delete"]);
</script>

<template>
  <div>
    <DiaryCard
      v-for="entry in entries"
      :key="entry._id"
      :entry="entry"
      :decodeText="decodeText"
      :formatDate="formatDate"
      :myUserId="myUserId"

      @favorite="$emit('favorite', $event)"
      @read="$emit('read', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>