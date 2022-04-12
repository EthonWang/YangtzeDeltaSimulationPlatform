import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// import Data from "@/views/Data.vue";
import Model from "@/views/Model.vue";
import Method from "@/views/Method.vue";
import Help from "@/views/Help.vue";
// import Functions from "@/views/Function.vue";

const routes = [
  {
    index:0,
    path: "/",
    name: "首页",
    component: Home,
  },
  {
    index:1,
    path: "/model",
    name: "模型",
    component: Model,
  },
  {
    index:2,
    path: "/case",
    name: "案例",
    component: Method,
  },
  
  {
    index:3,
    path: "/about",
    name: "关于",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    index:4,
    path: "/test",
    name: "测试",
    component: Help,
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
