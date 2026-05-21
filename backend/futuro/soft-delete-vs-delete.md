# Soft delete vs delete real

//backend
//backend/src/models/diary.model.js
// blocked: {
//   type: Boolean,
//   default: false
// },

```js
deletedAt: {
  type: Date,
  default: null
},
deletedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},
```

//backend
//backend/src/controllers/diary.controller.js
// try {

```js
await Diary.findOneAndUpdate(
  { _id: req.params.id, user: req.user.id },
  { deletedAt: new Date(), deletedBy: req.user.id }
);
```

//backend
//backend/src/controllers/diary.controller.js
// if(req.user.role === "admin") {

```js
const entries = await Diary.find({ deletedAt: null, ...otherFilters });
```

---

## Frontend

//fronted
//fronted/src/components/DiaryCard.vue
// <button @click="$emit('delete', entry._id)">

```js
<button 
  @click="$emit('delete', entry._id)"
  class="delete-btn"
  title="Marcar como eliminado"
>
   Eliminar
</button>
```

//fronted
//fronted/src/views/diaryForm.vue
// await api.delete(`/diary/${entryId}`);

```js
const deleteEntry = async (entryId) => {
  if (confirm("¿Marcar como eliminado? (Se puede recuperar)")) {
    try {
      await api.delete(`/diary/${entryId}`);
      entries.value = entries.value.filter(e => e._id !== entryId);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }
};
```

//fronted
//fronted/src/components/DiaryList.vue
// v-if="!entry.deletedAt"

```js
<DiaryCard
  v-if="!entry.deletedAt"
  v-for="entry in entries"
  :key="entry._id"
  :entry="entry"
  @delete="$emit('delete', $event)"
/>
```
