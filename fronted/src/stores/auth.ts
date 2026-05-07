import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {

  const token = ref(
    sessionStorage.getItem("token") || ""
  );

  const user = ref(null);

  const setToken = (newToken: string) => {
    token.value = newToken;
    sessionStorage.setItem("token", newToken);
  };

  const logout = () => {
    token.value = "";
    user.value = null;

    sessionStorage.removeItem("token");
  };

  return {
    token,
    user,

    setToken,
    logout
  };
});