# Titles for Diaries — Validaciones y diseño

Resumen

- Objetivo: permitir asignar `title` a las entradas al crearlas/editarse y validar que el `title` cumpla restricciones alfanuméricas y adicionales. Mantener el estilo y lógica de `warnings-system.md`.

---

//backend
//backend/src/models/diary.model.js
// Agregar campo `title` al modelo `Diary`.

```js
title: {
  type: String,
  trim: true,
  minlength: 3,
  maxlength: 60,
  default: null
},
```

Notas:
- `trim: true` elimina espacios al inicio/fin.
- `default: null` permite entradas sin título si se desea.

---

//backend
//backend/src/controllers/diary.controller.js
// Validaciones al crear/actualizar entradas (propuesta)

```js
// Helpers (al inicio del archivo)
const titleRegex = /^[A-Za-z0-9]+$/; // solo caracteres alfanuméricos, sin espacios
const forbiddenTitleWords = ["admin", "banned", "hack"];

// En createEntry
export const createEntry = async (req, res, next) => {
  try {
    const { title, content, fontFamily, visibility, sharedWith } = req.body;

    // Validar título (si viene)
    if (typeof title !== 'undefined' && title !== null) {
      const trimmed = String(title).trim();

      if (trimmed.length === 0) {
        return res.status(400).json({ message: "El título no puede estar vacío" });
      }

      if (trimmed.length < 3 || trimmed.length > 60) {
        return res.status(400).json({ message: "El título debe tener entre 3 y 60 caracteres" });
      }

      if (!titleRegex.test(trimmed)) {
        return res.status(400).json({ message: "El título solo puede contener caracteres alfanuméricos sin espacios" });
      }

      const lower = trimmed.toLowerCase();
      const forbidden = forbiddenTitleWords.some((w) => lower.includes(w));
      if (forbidden) {
        return res.status(400).json({ message: "El título contiene palabras no permitidas" });
      }

      // (Opcional) evitar títulos numéricos puros
      if (/^[0-9]+$/.test(trimmed)) {
        return res.status(400).json({ message: "El título no puede ser solo números" });
      }

      req.body.title = trimmed; // normalizar
    }

    // ... resto del createEntry existente

    const entry = new Diary({
      user: req.user.id,
      title: req.body.title || null,
      content,
      fontFamily,
      visibility,
      sharedWith: usersShared
    });

    await entry.save();

    res.json({ message: "Entrada guardada" });
  } catch (error) {
    next(error);
  }
};
```

```js
// En updateEntry, aplicar las mismas validaciones antes de actualizar
// (insertar la misma lógica de validación de `title` y asignar `title: trimmed` en la actualización)
```

---



## Frontend

//fronted
//fronted/src/router/index.ts
// { path: "/diary", component: DiaryForm, meta: { requiresAuth: true } }

```js
{
  path: "/admin/audits",
  component: AdminPanel,
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

//fronted
//fronted/src/components/DiaryEditor.vue
// <input type="text" v-model="title" placeholder="Título (solo letras y números)" maxlength="60" />

```vue
<input
  type="text"
  v-model="title"
  placeholder="Título (solo letras y números)"
  maxlength="60"
/
>
```

//fronted
//fronted/src/views/diaryForm.vue
// En el POST/PUT incluir `title: title.value` y mostrar mensajes de error si el backend responde 400.

```js
try {
  const payload = {
    title: title.value || undefined,
    content: text.value,
    fontFamily: fontFamily.value,
    visibility: visibility.value,
    sharedWith: sharedWith.value.split(",").map(u => u.trim())
  };

  const response = await api.post("/diary", payload);
  // manejar respuesta
} catch (error) {
  const msg = error.response?.data?.message || "Error al guardar";
  titleWarning.value = msg.includes('título') ? msg : null;
}
```

---


