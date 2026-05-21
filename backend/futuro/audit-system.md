# Auditoría básica

//backend
//backend/src/models/audit.model.js
// (archivo nuevo, insertar al inicio)

```js
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    enum: [
      "usuario-baneado",
      "usuario-desbaneado",
      "entrada-bloqueada",
      "entrada-desbloqueada",
      "eliminar-entrada",
      "hacer-admin"
    ],
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  targetEntry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Diary",
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Audit", auditSchema);
```

//backend
//backend/src/controllers/audit.controller.js
// (archivo nuevo, insertar al inicio)

```js
import Audit from "../models/audit.model.js";

export const getAudits = async (req, res, next) => {
  try {
    const logs = await Audit.find()
      .populate("admin", "username")
      .populate("targetUser", "username")
      .populate("targetEntry", "content visibility")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
```

//backend
//backend/src/routes/audit.routes.js
// (archivo nuevo, insertar al inicio)

```js
import express from "express";
import { getAudits } from "../controllers/audit.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();
router.get("/audits", verifyToken, roleMiddleware("admin"), getAudits);
export default router;
```

//backend
//backend/src/app.js
// import errorMiddleware from "./middlewares/error.middleware.js";

```js
import auditRoutes from "./routes/audit.routes.js";
app.use("/api", auditRoutes);
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
//fronted/src/services/api.js
// export default api;

```js
export const getAudits = () => api.get("/audits");
export const blockUser = (userId) => api.put(`/diary/block-user/${userId}`);
export const blockEntry = (entryId) => api.put(`/diary/block-entry/${entryId}`);
```

//fronted
//fronted/src/components (nuevo archivo AdminPanel.vue)
// (archivo nuevo)

```js
<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const audits = ref([]);
const loading = ref(false);

const fetchAudits = async () => {
  loading.value = true;
  try {
    const response = await api.get("/audits");
    audits.value = response.data;
  } catch (error) {
    console.error("Error fetching audits:", error);
  }
  loading.value = false;
};

onMounted(fetchAudits);
</script>

<template>
  <div class="admin-panel">
    <h2>Panel de Auditoría</h2>
    <table v-if="audits.length" class="audits-table">
      <thead>
        <tr>
          <th>Acción</th>
          <th>Admin</th>
          <th>Usuario</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="audit in audits" :key="audit._id">
          <td>{{ audit.action }}</td>
          <td>{{ audit.admin.username }}</td>
          <td>{{ audit.targetUser?.username || "N/A" }}</td>
          <td>{{ new Date(audit.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```
