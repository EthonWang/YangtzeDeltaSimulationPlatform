import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Data from "@/views/Data.vue";
import Model from "@/views/Model.vue";
import Method from "@/views/Method.vue";
import Help from "@/views/Help.vue";
import Functions from "@/views/Function.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/data",
    name: "Data",
    component: Data,
  },
  {
    path: "/model",
    name: "Model",
    component: Model,
  },
  {
    path: "/method",
    name: "Method",
    component: Method,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
  {
    path: "/function",
    name: "Function",
    component: Functions,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
