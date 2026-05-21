# Permisos por acción

//backend
//backend/src/middlewares/actionPermission.js
// (nuevo archivo)

```js
export default function actionPermission(action) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "No autorizado" });

    if (user.role === "admin") return next();

    const ownerActions = ["deleteEntry", "editEntry"];
    if (ownerActions.includes(action)) {
      const entry = await Diary.findById(req.params.id);
      if (!entry || entry.user.toString() !== user.id) {
        return res.status(403).json({ message: "No permitido" });
      }
      return next();
    }

    return res.status(403).json({ message: "No permitido" });
  };
}
```

//backend
//backend/src/routes/diary.routes.js
// router.delete(

```js
router.delete("/:id", verifyToken, actionPermission("deleteEntry"), deleteEntry);
router.put("/:id", verifyToken, actionPermission("editEntry"), updateEntry);
router.put("/block-user/:id", verifyToken, actionPermission("blockUser"), blockUser);
```

---

## Frontend

//fronted
//fronted/src/components/DiaryCard.vue
// <button @click="$emit('edit', entry._id)">

```js
<button 
  v-if="entry.user._id === myUserId || isAdmin"
  @click="$emit('edit', entry._id)"
  class="edit-btn"
>
   Editar
</button>
<button 
  v-if="entry.user._id === myUserId || isAdmin"
  @click="$emit('delete', entry._id)"
  class="delete-btn"
>
   Eliminar
</button>
```

//fronted
//fronted/src/components/DiaryList.vue
// @edit="$emit('edit', $event)"

```js
@edit="$emit('edit', $event)"
@delete="$emit('delete', $event)"
```
