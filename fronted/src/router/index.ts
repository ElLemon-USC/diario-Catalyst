import { createRouter, createWebHistory } from "vue-router";

import Landing from "../views/Landing.vue";
import Auth from "../views/Auth.vue";
import DiaryForm from "../views/diaryForm.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      component: Landing
    },

    {
      path: "/auth",
      component: Auth
    },

    {
      path: "/diary",
      component: DiaryForm,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to) => {

  const token = sessionStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return "/auth";
  }
});

export default router;