<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../services/api";

import { encryptText, decryptText } from "../utils/encryption";

import DiaryList from "../components/DiaryList.vue";
import Toolbar from "../components/Toolbar.vue";
import DiaryEditor from "../components/DiaryEditor.vue";

import MainLayout from "../layouts/MainLayout.vue";

import DiaryReader from "../components/DiaryReader.vue";

import "../assets/themes/dark.css";
import "../assets/themes/light.css";
import "../assets/themes/sakura.css";
import "../assets/themes/stone-ocean.css";
import "../assets/themes/forest.css";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const readingEntry = ref(null);
const text = ref("");
const entries = ref([]);
const fontFamily = ref("Arial");
const search = ref("");
const filter = ref("all");
const order = ref("desc");
const editingId = ref(null);
const theme = ref("dark");
const visibility = ref("private");
const sharedWith = ref("");
const errorMessage = ref("");
const palabrasProhibidas = ["hack", "virus"];
const myUserId = ref("");
const isAdmin = ref(false);

watch(theme, (newTheme) => {
  document.body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
})

const loadEntries = async () => {
  try {

    const res = await api.get("/diary", {
    });

    entries.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

const checkToken = () => {

  const token = authStore.token;

  if (!token) return false;

  try {

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const now = Date.now() / 1000;

    if (payload.exp < now) {
      authStore.logout();
      location.reload();
      return false;
    }

    myUserId.value = payload.id;
    isAdmin.value = payload.role === "admin";

    return true;

  } catch {

    authStore.logout();
    location.reload();

    return false;
  }
};

const contenidoInvalido = () => {
  const lower = text.value.toLowerCase();

  const contieneProhibida = palabrasProhibidas.some(palabra => lower.includes(palabra));
  const Numeros =
  text.value.match(/\d/g) || [];
  
  return (
    Numeros.length > 35 ||
    contieneProhibida
  );
};


const sendDiary = async () => {
  try {
    errorMessage.value = "";
    if (!text.value.trim()) {
      errorMessage.value = "La entrada no puede estar vacía";
      return;
    }

    const cifrado = encryptText(text.value);
    const sharedUsers =
     visibility.value === "shared"
     ? sharedWith.value.split(",").map(id => id.trim()).filter(Boolean)
     : [];
    console.log("FUENTE ENVIADA:", fontFamily.value);

    if (editingId.value) {

      await api.put(
        `/diary/${editingId.value}`,
        {
           content: cifrado,
           fontFamily: fontFamily.value,
           visibility: visibility.value,
           sharedWith: sharedUsers
          },
      );

      editingId.value = null;

    } else {

      await api.post(
        "diary",
        {
          content: cifrado,
          fontFamily: fontFamily.value,
          visibility: visibility.value,
          sharedWith: sharedUsers
        },
      );
    }

    text.value = "";
    loadEntries();

  } catch (error) {
    console.error(error);
  }
};

const decodeText = (content) => {
  try {
    return decryptText(content) || content;
  } catch {
    return content;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

const filteredEntries = () => {
  let result = [...entries.value];

  const now = new Date();

  // FILTRO
  if (filter.value === "favorite") {
    result = result.filter(entry => entry.favorite);
  }

  if (filter.value === "recent") {
    result = result.filter(entry => {
      const days =
        (now - new Date(entry.createdAt)) / 86400000;
      return days <= 7;
    });
  }

  if (filter.value === "week") {
    result = result.filter(entry => {
      const days =
        (now - new Date(entry.createdAt)) / 86400000;
      return days > 7 && days <= 14;
    });
  }

  // BUSCADOR
  if (search.value.trim()) {
    const txt = search.value.toLowerCase();

    result = result.filter(entry => {
      const content = decodeText(entry.content).toLowerCase();

      const date = formatDate(entry.createdAt).toLowerCase();

      return content.includes(txt) || date.includes(txt);
    });
  }

  // ORDEN
  result.sort((a, b) => {
    if (order.value === "desc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return result;
};

const logout = () => {
  authStore.logout();
  location.reload();
};

const deleteDiary = async (id) => {

  const seguro = confirm("¿Seguro que quieres eliminar esta entrada?");

  if (!seguro) return;

  await api.delete(
    `/diary/${id}`,
  );

  loadEntries();
};

const editDiary = (entry) => {
  text.value = decodeText(entry.content);
  editingId.value = entry._id;
  fontFamily.value = entry.fontFamily || "Arial";
};

const cancelEdit = () => {
  editingId.value = null;
  text.value = "";
};

const openReader = (entry) => {
  readingEntry.value = entry;
};

const closeReader = () => {
  readingEntry.value = null;
};

const toggleFavorite = async (entry) => {
  try {

    await api.put(
      `/diary/${entry._id}/favorite`,
      {},
    );

    loadEntries();

  } catch (error) {
    console.error(error);

    errorMessage.value = error.response?.data?.message || "Error al guardar entrada";
  }
};


const blockEntry = async (entry) => {

  try {

    await api.put(`/diary/block-entry/${entry._id}`);

    if(entry.blocked) {
      alert("Entrada bloqueada");
    } else {
      alert("Entrada desbloqueada");
    }

    loadEntries();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Error al bloquear entrada"
    );
  }
};

const blockUser = async (entry) => {

  try {

    await api.put(`/diary/block-user/${entry.user._id}`);

    if(entry.user.blocked) {
    alert("Usuario baneado");
    } else {
      alert("Usuario desbaneado");
    }

    loadEntries();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Error al bloquear usuario"
    );
  }
};


onMounted(() => {
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme) {
    theme.value = savedTheme
  }

  document.body.setAttribute("data-theme", theme.value)

  if (checkToken()) {
    loadEntries()
  }
});

const comments = ref([])

</script>

<template>
  <MainLayout
    title="Diario Privado !.!"
    @logout="logout"
  >

     <Toolbar
     :search="search"
     :fontFamily="fontFamily"
     :filter="filter"
     :order="order"
     :theme="theme"

     @update:search="search = $event"
     @update:fontFamily="fontFamily = $event"
     @update:filter="filter = $event"
     @update:order="order = $event"
     @update:theme="theme = $event"
    />

    <br><br>

  <p v-if = "errorMessage" class="error-message">
    {{ errorMessage }}
  </p>

  <p
    v-if="contenidoInvalido()"
    class="error-message"
  >
    El contenido es sospechoso
  </p>

    <DiaryEditor
      :text="text"
      :fontFamily="fontFamily"
      :editingId="editingId"
      :visibility="visibility"
      :sharedWith="sharedWith"
      :contenidoInvalido="contenidoInvalido"

      @update:text="text = $event"
      @update:visibility="visibility = $event"
      @update:sharedWith="sharedWith = $event"
      @save="sendDiary"
      @cancel="cancelEdit"
      />

    <hr>

    <DiaryList
  :entries="filteredEntries()"
  :decodeText="decodeText"
  :formatDate="formatDate"
  :myUserId="myUserId"
  :isAdmin="isAdmin"
  
  @favorite="toggleFavorite"
  @read="openReader"
  @edit="editDiary"
  @delete="deleteDiary"
  @block-entry="blockEntry"
  @block-user="blockUser"
/>

<DiaryReader
  v-if="readingEntry"
  :entry="readingEntry"
  :decodeText="decodeText"
  @close="closeReader"
/>


  </MainLayout>
</template>
