# Historial de cambios en entradas

//backend
//backend/src/models/diaryHistory.model.js
// (archivo nuevo, insertar al inicio)

```js
import mongoose from "mongoose";

const diaryHistorySchema = new mongoose.Schema({
  entry: { type: mongoose.Schema.Types.ObjectId, ref: "Diary", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  changes: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DiaryHistory", diaryHistorySchema);
```

//backend
//backend/src/controllers/diary.controller.js
// await Diary.findOneAndUpdate(

```js
import DiaryHistory from "../models/diaryHistory.model.js";

await DiaryHistory.create({
  entry: diary._id,
  user: req.user.id,
  action: "update",
  changes: { before: oldData, after: newData }
});
```

//backend
//backend/src/routes/diary.routes.js
// router.put("/:id", verifyToken, updateEntry);

```js
router.get("/:id/history", verifyToken, getDiaryHistory);
```

---

## Frontend

//fronted
//fronted/src/router/index.ts
// { path: "/diary", component: DiaryForm, meta: { requiresAuth: true } }

```js
{
  path: "/diary/:id/history",
  component: EntryHistory,
  meta: { requiresAuth: true }
}
```

//fronted
//fronted/src/services/api.js
// export default api;

```js
export const getEntryHistory = (entryId) => api.get(`/diary/${entryId}/history`);
```

//fronted
//fronted/src/views (nuevo archivo EntryHistory.vue)
// (archivo nuevo)

```js
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getEntryHistory } from "../services/api";

const route = useRoute();
const history = ref([]);
const loading = ref(false);

const fetchHistory = async () => {
  loading.value = true;
  try {
    const response = await getEntryHistory(route.params.id);
    history.value = response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
  }
  loading.value = false;
};

onMounted(fetchHistory);
</script>

<template>
  <div class="entry-history">
    <h2>Historial de cambios</h2>
    <div v-if="history.length" class="history-list">
      <div v-for="change in history" :key="change._id" class="history-item">
        <p><strong>{{ change.action }}</strong> - {{ new Date(change.createdAt).toLocaleString() }}</p>
        <pre v-if="change.changes">{{ JSON.stringify(change.changes, null, 2) }}</pre>
      </div>
    </div>
    <p v-else>Sin cambios registrados</p>
  </div>
</template>
```
