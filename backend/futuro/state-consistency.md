# Consistencia de estado

//backend
//backend/src/models/diary.model.js
// blocked: {
//   type: Boolean,
//   default: false
// },

```js
status: {
  type: String,
  enum: ["private", "public", "shared", "blocked", "deleted"],
  default: "private"
},
```

//backend
//backend/src/controllers/diary.controller.js
// const existingEntry = await Diary.findById(req.params.id);

```js
if (entry.blocked && entry.deletedAt) {
  return res.status(400).json({ message: "Estado inconsistente" });
}

if (entry.status === "deleted") {
  return res.status(400).json({ message: "Entrada eliminada" });
}
```

---

## Frontend

//fronted
//fronted/src/components/DiaryCard.vue
// <div class="diary-card">

```js
<div v-if="entry.status !== 'deleted'" class="diary-card">
  <!-- contenido de la entrada -->
</div>

<div v-else class="diary-card deleted">
  <p>Esta entrada ha sido eliminada</p>
</div>
```

//fronted
//fronted/src/components/DiaryEditor.vue
// <div class="editor-actions">

```js
<div v-if="entry && entry.status === 'blocked'" class="entry-blocked">
  <p> Esta entrada está bloqueada</p>
</div>

<div class="editor-actions" v-if="entry && entry.status !== 'deleted'">
  <button @click="$emit('save')">Guardar</button>
</div>
```
