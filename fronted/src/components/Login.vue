<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      email: email.value,
      password: password.value
    });

    // GUARDAR TOKEN
    sessionStorage.setItem("token", response.data.token);

    alert("Login exitoso");

  } catch (error) {
    console.error(error);
    alert("Error en login");
  }
};
</script>

<template>
  <div>
    <h2>Login</h2>

    <input v-model="email" placeholder="Email" />
    <br><br>

    <input v-model="password" type="password" placeholder="Password" />
    <br><br>

    <button @click="login">Ingresar</button>
  </div>
</template>