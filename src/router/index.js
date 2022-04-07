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
    name: "首页",
    component: Home,
  },
  
  {
    path: "/data",
    name: "数据",
    component: Data,
  },
  {
    path: "/model",
    name: "模型",
    component: Model,
  },
  {
    path: "/method",
    name: "方法",
    component: Method,
  },
  {
    path: "/function",
    name: "功能",
    component: Functions,
  },
  {
    path: "/help",
    name: "帮助",
    component: Help,
  },
  {
    path: "/about",
    name: "关于",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
