<script setup>
import { ref, watch } from "vue";
import api from "../services/api";
import "../assets/auth.css";
import { useAuthStore } from "../stores/auth";

const mode = ref("login");

const username = ref("");
const email = ref("");
const password = ref("");
const isAdmin = ref(false);
const adminPassword = ref("");
const loginAdmin = ref(false);
const authStore = useAuthStore();
const description = ref("");

watch(mode, () => {
   loginAdmin.value = false;
   isAdmin.value = false;
   adminPassword.value = "";
});

const submit = async () => {

  // VALIDAR EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    alert("Correo inválido. Usa ejemplo@correo.com");
    return;
  }

  // VALIDAR PASSWORD
  if (password.value.length < 6) {
    alert("La contraseña debe tener mínimo 6 caracteres");
    return;
  }

  // VALIDAR USERNAME SOLO REGISTER
  if (
    mode.value === "register" &&
    username.value.trim().length < 3
  ) {
    alert("Username mínimo 3 caracteres");
    return;
  }

  if (mode.value === "register") {
    const descriptionLength = description.value.trim().length;
    if (descriptionLength < 30 || descriptionLength > 100) {
      alert("La descripción debe tener entre 30 y 100 caracteres");
      return;
    }
  }

  try {

    if (mode.value === "register") {

      await api.post("/auth/register", {
        username: username.value,
        email: email.value,
        password: password.value,
        description: description.value.trim(),
        role: isAdmin.value ? "admin" : "user",
        adminPassword: adminPassword.value
      });

      alert("Usuario creado");
      mode.value = "login";
      return;
    }

    const res = await api.post(
      "/auth/login",
      {
        email: email.value,
        password: password.value,
        loginAdmin: loginAdmin.value,
        adminPassword: adminPassword.value,
      }
    );

    authStore.setToken(res.data.token);
    location.reload();

  } catch (error) {

  console.error(error);

  alert(
    error.response?.data?.message ||
    "Error en autenticación"
  );
 }
};
</script>

<template>
  <div class="auth-box">

    <h1 v-if="mode === 'login'">Bienvenido</h1>
    <h1 v-else>Crear cuenta</h1>

    <input
      v-if="mode === 'register'"
      v-model="username"
      placeholder="Username"
    />

    <input v-model="email" placeholder="Email" />

    <input
      v-model="password"
      type="password"
      placeholder="Password"
    />

    <input v-model="description" placeholder="description"/>


    <label v-if="mode === 'register'">
      <input
        type="checkbox"
        v-model="isAdmin"
      />
      Crear como Admin
    </label>

    <label v-if="mode === 'login'">
      <input
        type="checkbox"
        v-model="loginAdmin"
      />
      Entrar como Admin
    </label>

    <input v-if="
     (mode === 'register' && isAdmin) ||
     (mode === 'login' && loginAdmin)
     "
      v-model="adminPassword"
      type="password"
      placeholder="Contraseña Admin"
    />

    <button @click="submit">
      {{ mode === "login" ? "Ingresar" : "Registrarse" }}
    </button>

    <div class="switch-mode">
      <button @click="mode='login'">Login</button>
      <button @click="mode='register'">Register</button>
    </div>

  </div>
</template>