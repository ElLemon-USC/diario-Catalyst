<script setup>
import "../assets/diary-cards.css";

defineProps({
  entry: Object,
  decodeText: Function,
  formatDate: Function,
  myUserId: String
});

defineEmits(["favorite", "read", "edit", "delete"]);
</script>

<template>
  <div class="card">

    <small>{{ formatDate(entry.createdAt) }}</small>
      <small>
       {{
       entry.visibility === "public"
       ? "🌍 Público"
       : entry.visibility === "shared"
       ? "👥 Compartido"
       : "🔒 Privado"
       }}
      </small>

    <p :style="{ fontFamily: entry.fontFamily || 'Arial' }">
      {{
        decodeText(entry.content).length > 180
          ? decodeText(entry.content).slice(0, 180) + "..."
          : decodeText(entry.content)
      }}
    </p>

    <div class="actions">

      <button
       v-if="entry.user && entry.user._id === myUserId"
       @click="$emit('favorite', entry)">
        {{ entry.favorite ? "⭐" : "☆" }}
      </button>

      <button @click="$emit('read', entry)">
        Leer
      </button>

      <button
       v-if="entry.user && entry.user._id === myUserId"
       @click="$emit('edit', entry)"
       >
        Editar
      </button>

      <button
      v-if="entry.user && entry.user._id === myUserId"
      @click="$emit('delete', entry._id)"
      >
      Eliminar
    </button>

    </div>

  </div>
</template>