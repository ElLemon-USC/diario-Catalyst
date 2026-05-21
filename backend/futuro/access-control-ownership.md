# Control de acceso por propiedad

//backend
//backend/src/controllers/diary.controller.js
// const existingEntry = await Diary.findById(req.params.id);

```js
const entry = await Diary.findOne({ _id: req.params.id, user: req.user.id });
if (!entry) {
  return res.status(403).json({ message: "No eres propietario" });
}
```

//backend
//backend/src/routes/diary.routes.js
// router.put("/:id", verifyToken, updateEntry);

```js
router.put("/:id", verifyToken, updateEntry);
router.delete("/:id", verifyToken, deleteEntry);
```

---

## Frontend

//fronted
//fronted/src/components/DiaryCard.vue
// <div class="diary-card">

```js
<div class="diary-card">
  <!-- contenido -->
  <div v-if="isOwnerOrAdmin" class="actions">
    <button @click="$emit('edit', entry._id)"></button>
    <button @click="$emit('delete', entry._id)"></button>
  </div>
  <p v-else class="no-permissions">No tienes permisos</p>
</div>
```

//fronted
//fronted/src/views/diaryForm.vue
// const editingId = ref(null);

```js
const isOwner = (entry) => {
  return entry.user._id === authStore.user?._id;
};

const canEdit = (entry) => {
  return isOwner(entry) || authStore.isAdmin;
};
```
