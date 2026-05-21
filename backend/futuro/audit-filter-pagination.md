# Auditoría filtrable y paginada

//backend
//backend/src/controllers/audit.controller.js
// (archivo nuevo, insertar al final)

```js
export const getAuditsFiltered = async (req, res, next) => {
  try {
    const { admin, action, fromDate, toDate, limit = 20, skip = 0 } = req.query;
    const filter = {};

    if (admin) filter.admin = admin;
    if (action) filter.action = action;
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const logs = await Audit.find(filter)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    next(error);
  }
};
```

//backend
//backend/src/routes/audit.routes.js
// router.get("/audits", verifyToken, roleMiddleware("admin"), getAudits);

```js
router.get("/audits", verifyToken, roleMiddleware("admin"), getAuditsFiltered);
```

//fronted
//fronted/src/router/index.ts
// { path: "/admin/audits", component: AdminPanel }

```js
{
  path: "/admin/audits-filter",
  component: AdminPanelFiltered,
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

//fronted
//fronted/src/services/api.js
// export const getAudits = () => api.get("/audits");

```js
export const getAuditsFiltered = (filters) => {
  const params = new URLSearchParams();
  if (filters.admin) params.append("admin", filters.admin);
  if (filters.action) params.append("action", filters.action);
  if (filters.fromDate) params.append("fromDate", filters.fromDate);
  if (filters.toDate) params.append("toDate", filters.toDate);
  params.append("limit", filters.limit || 20);
  params.append("skip", filters.skip || 0);
  return api.get(`/audits?${params.toString()}`);
};
```

//fronted
//fronted/src/components (nuevo archivo AdminPanelFiltered.vue)
// (archivo nuevo)

```js
<script setup>
import { ref, onMounted } from "vue";
import { getAuditsFiltered } from "../services/api";

const filters = ref({
  admin: "",
  action: "",
  fromDate: "",
  toDate: "",
  limit: 20,
  skip: 0
});

const audits = ref([]);
const loading = ref(false);

const fetchAudits = async () => {
  loading.value = true;
  try {
    const response = await getAuditsFiltered(filters.value);
    audits.value = response.data;
  } catch (error) {
    console.error("Error fetching filtered audits:", error);
  }
  loading.value = false;
};

onMounted(fetchAudits);
</script>

<template>
  <div class="admin-panel-filtered">
    <div class="filters">
      <input v-model="filters.fromDate" type="date" placeholder="Desde">
      <input v-model="filters.toDate" type="date" placeholder="Hasta">
      <select v-model="filters.action">
        <option value="">Todas las acciones</option>
        <option>usuario-baneado</option>
        <option>usuario-desbaneado</option>
      </select>
      <button @click="fetchAudits">Filtrar</button>
    </div>
    <table v-if="audits.length">
      <tbody>
        <tr v-for="audit in audits" :key="audit._id">
          <td>{{ audit.action }}</td>
          <td>{{ audit.admin.username }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```
