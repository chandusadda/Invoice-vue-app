import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

/**
 * router will hold the app routers
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      props: true
    },
    {
      path: "/invoice/:id",
      name: "invoice",
      component: () => import("../components/Invoices/Invoice-view/InvoiceView.vue"),
      props: true
    },
  ],
});

export default router;
