<script setup>
defineProps({
  text: String,
  fontFamily: String,
  editingId: String,
  visibility: String,
  sharedWith: String
});

defineEmits([
  "update:text",
  "update:visibility",
  "update:sharedWith",
  "save",
  "cancel"
]);
</script>

<template>
 <div class="editor-box">

  <textarea
    :value="text"
    @input="$emit('update:text', $event.target.value)"
    :style="{ fontFamily: fontFamily }"
    placeholder="Escribe tu pensamiento..."
  ></textarea>

  <div class="editor-options">

    <select
      :value="visibility"
      @change="$emit('update:visibility', $event.target.value)"
    >
      <option value="private">🔒 Privado</option>
      <option value="public">🌍 Público</option>
      <option value="shared">👥 Compartido</option>
    </select>

    <textarea
      v-if="visibility === 'shared'"
      :value="sharedWith"
      @input="$emit('update:sharedWith', $event.target.value)"
      placeholder="Usernames separados por coma"
      class="shared-input"
    />

  </div>

  <div class="editor-actions">
    <button @click="$emit('save')">
      {{ editingId ? "Actualizar" : "Guardar" }}
    </button>

    <button
      v-if="editingId"
      @click="$emit('cancel')"
      class="cancel-btn"
    >
      Cancelar
    </button>
  </div>

</div>
</template>