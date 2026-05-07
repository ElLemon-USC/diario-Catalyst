<script setup>
import "../assets/landing.css";

const goAuth = () => {
  window.location.hash = "#auth";
};
</script>

<template>
  <div class="landing">

    <h1>📔 Diario Catalyst</h1>

    <p>
      Guarda tus pensamientos de forma segura, compártelos y controla su visibilidad.
    </p>

    <button @click="goAuth">
      Empezar
    </button>

    <div class="features">

      <div class="feature">
        <h3>🔒 Privado</h3>
        <p>Solo tú puedes ver tus entradas</p>
      </div>

      <div class="feature">
        <h3>🌍 Público</h3>
        <p>Comparte con todos los usuarios</p>
      </div>

      <div class="feature">
        <h3>👥 Compartido</h3>
        <p>Elige exactamente con quién compartir</p>
      </div>

    </div>

  </div>
</template>