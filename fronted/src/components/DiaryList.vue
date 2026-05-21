<script setup>
import DiaryCard from "./DiaryCard.vue";

defineProps({
  entries: Array,
  decodeText: Function,
  formatDate: Function,
  myUserId: String,
  isAdmin: Boolean
});

defineEmits(["favorite", "read", "edit", "delete", "block-entry", "block-user"]);
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
      :isAdmin="isAdmin"

      @favorite="$emit('favorite', $event)"
      @read="$emit('read', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
      @block-entry="$emit('block-entry', $event)"
      @block-user="$emit('block-user', $event)"
      
    />
  </div>
</template>