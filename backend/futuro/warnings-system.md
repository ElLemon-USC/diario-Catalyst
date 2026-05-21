# Warnings y bloqueo temporal

//backend
//backend/src/models/user.model.js
// BloquearHasta: { type: Date, default: null },

```js
warnings: {
  type: Number,
  default: 0
},
blockedUntil: {
  type: Date,
  default: null
},
```

//backend
//backend/src/controllers/auth.controller.js
// if (user.blocked) {

```js
if (user.blockedUntil && user.blockedUntil > new Date()) {
  return res.status(403).json({
    message: "Usuario bloqueado temporalmente"
  });
}

if (user.blockedUntil && user.blockedUntil <= new Date()) {
  user.blockedUntil = null;
  user.warnings = 0;
  await user.save();
}
```

//backend
//backend/src/controllers/diary.controller.js
// const { content, fontFamily, visibility, sharedWith } = req.body;

```js
const suspiciousWords = ["hack", "virus", "spam", "insulto", "troll"];
```

```js
if (user.blockedUntil && user.blockedUntil > new Date()) {
  return res.status(403).json({
    message: "Usuario bloqueado temporalmente"
  });
}

if (user.blockedUntil && user.blockedUntil <= new Date()) {
  user.blockedUntil = null;
  user.warnings = 0;
  await user.save();
}
```

// const lowerContent = content.toLowerCase();

```js
const lowerContent = content.toLowerCase();
const suspicious = suspiciousWords.some((word) => lowerContent.includes(word));
if (suspicious) {
  user.warnings += 1;
  if (user.warnings >= 3) {
    user.blockedUntil = new Date(Date.now() + 60 * 1000);
    user.warnings = 0;
  }
  await user.save();
  return res.status(400).json({
    message: "Contenido sospechoso detectado. Se ha registrado una advertencia."
  });
}
```

---

## Frontend

//fronted
//fronted/src/components/DiaryEditor.vue
// <textarea :value="text"

```js
<div v-if="warningMessage" class="warning-alert">
   {{ warningMessage }}
</div>

<textarea
  :value="text"
  @input="$emit('update:text', $event.target.value)"
  :style="{ fontFamily: fontFamily }"
  placeholder="Escribe tu pensamiento..."
></textarea>
```

//fronted
//fronted/src/views/diaryForm.vue
// const response = await api.post("/diary", {

```js
try {
  const response = await api.post("/diary", {
    content: text.value,
    fontFamily: fontFamily.value,
    visibility: visibility.value,
    sharedWith: sharedWith.value.split(",").map(u => u.trim())
  });
  
  if (response.status === 400 && response.data.message.includes("sospechoso")) {
    warningMessage.value = response.data.message;
  }
} catch (error) {
  warningMessage.value = error.response?.data?.message || "Error al guardar";
}
```
