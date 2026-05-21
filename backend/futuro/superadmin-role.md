# Rol superAdmin

//backend
//backend/src/models/user.model.js
// role: { type: String, enum: ["user", "admin"], default: "user" },

```js
role: {
  type: String,
  enum: ["user", "admin", "superAdmin"],
  default: "user"
},
```

//backend
//backend/src/controllers/auth.controller.js
// const { username, email, password, role, adminPassword } = req.body;

```js
export const setAdminStatus = async (req, res, next) => {
  try {
    const { userId, makeAdmin } = req.body;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (targetUser.role === "superAdmin") {
      return res.status(400).json({ message: "No se puede cambiar el rol de un superAdmin" });
    }

    targetUser.role = makeAdmin ? "admin" : "user";
    await targetUser.save();

    res.json({
      message: `Usuario actualizado a ${targetUser.role}`
    });
  } catch (error) {
    next(error);
  }
};
```

//backend
//backend/src/routes/auth.routes.js
// router.post("/register", register);

```js
import { setAdminStatus } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

router.put(
  "/admin-status",
  verifyToken,
  roleMiddleware("superAdmin"),
  setAdminStatus
);
```

//backend
//backend/src/controllers/diary.controller.js
// const existingEntry = await Diary.findById(req.params.id);

```js
const existingEntry = await Diary.findById(req.params.id);
if (existingEntry.blocked && req.user.role !== "superAdmin") {
  return res.status(400).json({
    message: "Entrada bloqueada. Solo superAdmin puede editarla."
  });
}
```

//backend
//backend/src/middlewares/role.middleware.js
// if (!roles.includes(req.user.role)) {

```js
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role) && req.user.role !== "superAdmin") {
      return res.status(403).json({
        message: "Acceso denegado"
      });
    }

    next();
  };
};
```

---

## Frontend

//fronted
//fronted/src/services/api.js
// export default api;

```js
export const setAdminStatus = (userId, makeAdmin) =>
  api.put("/auth/admin-status", {
    userId,
    makeAdmin
  });
```

//fronted
//fronted/src/stores/auth.ts
// const user = ref(null);

```ts
const isSuperAdmin = computed(() => user.value?.role === "superAdmin");

return {
  token,
  user,
  isSuperAdmin,

  setToken,
  logout
};
```

//fronted
//fronted/src/views/Auth.vue
// role: isAdmin.value ? "admin" : "user",

```js
const isSuperAdmin = ref(false);

// ...

await api.post("/auth/register", {
  username: username.value,
  email: email.value,
  password: password.value,
  role: isSuperAdmin.value ? "superAdmin" : isAdmin.value ? "admin" : "user",
  adminPassword: adminPassword.value
});
```

//fronted
//fronted/src/components/SuperAdminPanel.vue
// (archivo nuevo)

```vue
<script setup>
import { ref, onMounted } from "vue";
import { setAdminStatus } from "../services/api";
import api from "../services/api";

const users = ref([]);

const fetchUsers = async () => {
  const response = await api.get("/users");
  users.value = response.data;
};

const toggleAdmin = async (user) => {
  await setAdminStatus(user._id, user.role !== "admin");
  await fetchUsers();
};

onMounted(fetchUsers);
</script>

<template>
  <div class="superadmin-panel">
    <h2>SuperAdmin: gestión de roles</h2>
    <ul>
      <li v-for="user in users" :key="user._id">
        <span>{{ user.username }} ({{ user.role }})</span>
        <button
          v-if="user.role !== 'superAdmin'"
          @click="toggleAdmin(user)"
        >
          {{ user.role === 'admin' ? 'Quitar admin' : 'Hacer admin' }}
        </button>
      </li>
    </ul>
  </div>
</template>
```
