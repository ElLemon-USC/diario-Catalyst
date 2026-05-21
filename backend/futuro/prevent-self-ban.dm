# Evitar auto-baneo / auto-reporte

Resumen

- Objetivo: impedir que cualquier usuario (admin, superAdmin o user) pueda "autobanearse" o "autobloquearse" entradas propias, y evitar autoreportes. No se modifica el proyecto; esto es un diseño y snippets para integrar.

---

## Backend

//backend/src/controllers/diary.controller.js

```js
// Bloquear/desbloquear 
export const blockEntry = async (req, res, next) => {
  try {
    const entry = await Diary.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entrada no encontrada" });
    }

   
    if (entry.user.toString() === req.user.id) {
      return res.status(400).json({ message: "No puedes bloquear/desbloquear tu propia entrada" });
    }

    entry.blocked = !entry.blocked;
    await entry.save();

    res.json({
      message: entry.blocked ? "Entrada bloqueada" : "Entrada desbloqueada"
    });
  } catch (error) {
    next(error);
  }
};
```

//backend/src/controllers/diary.controller.js

```js
// Bloquear/desbloquear 
export const blockUser = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (target._id.toString() === req.user.id) {
      return res.status(400).json({ message: "No puedes banearte a ti mismo" });
    }

    // (Opcional) PREVENCIÓN ADICIONAL: impedir banear a superAdmin desde admin
    // if (target.role === 'superAdmin' && req.user.role !== 'superAdmin') {
    //   return res.status(403).json({ message: 'No puedes banear a un superAdmin' });
    // }

    target.blocked = !target.blocked;
    await target.save();

    res.json({
      message: target.blocked ? "Usuario baneado" : "Usuario desbaneado"
    });
  } catch (error) {
    next(error);
  }
};
```

### Middleware sugerido (opcional)

//backend/src/middlewares/preventSelf.middleware.js

```js
export const preventSelfAction = (req, res, next) => {
  if (req.user && req.params.id && req.user.id === req.params.id) {
    return res.status(400).json({ message: "Acción inválida sobre el propio recurso" });
  }
  next();
};
```

Y en rutas:

//backend/src/routes/diary.routes.js

```js
import { preventSelfAction } from "../middlewares/preventSelf.middleware.js";

router.put(
  "/block-user/:id",
  verifyToken,
  roleMiddleware("admin"),
  preventSelfAction, // evita autobaneo
  blockUser
);

router.put(
  "/block-entry/:id",
  verifyToken,
  roleMiddleware("admin"),
  // Nota: `preventSelfAction` revisa `req.params.id` contra `req.user.id`.
  // Para entradas se puede usar comprobación basada en la entrada (ver controller).
  blockEntry
);
```

### Comprobaciones y mensajes UX

- Respuestas HTTP y mensajes claros: `400` para intentos de auto-acción, `403` para intentos de actuar contra roles protegidos.
- Registrar en logs el intento (audit) si se desea.

---

## Reportes (autoreporte)

No existe implementación actual de "reportar" en el backend. Si se añade, seguir la misma regla:

- Al crear un endpoint `POST /reports` o similar, validar que `reporterId !== targetId`.

Ejemplo de controlador de reporting:

```js
export const createReport = async (req, res, next) => {
  try {
    const { targetUserId, reason } = req.body;

    if (targetUserId === req.user.id) {
      return res.status(400).json({ message: "No puedes reportarte a ti mismo" });
    }

    // crear reporte en DB...
    res.json({ message: 'Reporte creado' });
  } catch (error) {
    next(error);
  }
};
```

---

## Frontend

- En listados de usuarios y entradas, ocultar o deshabilitar los botones de "ban/block/report" cuando el `id` objetivo coincida con el `id` del usuario autenticado.

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
//fronted/src/components/UsersList.vue
// <button v-if="user._id !== auth.user._id" @click="ban(user)">Ban</button>

```vue
<button
  v-if="user._id !== auth.user._id"
  @click="ban(user)">
  Ban
</button>
```

---

## Integración sugerida

1. Aplicar los cambios en `diary.controller.js` (sustituyendo las funciones `blockEntry` y `blockUser`).
2. Añadir `preventSelf.middleware.js` si se prefiere centralizar la comprobación.
3. Agregar pruebas unitarias/integración que intenten realizar auto-baneo/auto-bloqueo y verifiquen `400`.
4. Actualizar frontend para ocultar botones.

---

¿Deseas que genere el parche (`apply_patch`) para integrar estos cambios en el backend ahora? Puedo crear los cambios de forma segura y ejecutar pruebas básicas.
