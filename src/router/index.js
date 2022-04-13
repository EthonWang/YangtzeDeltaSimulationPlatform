import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// import Data from "@/views/Data.vue";
import Model from "@/views/Model.vue";
import Method from "@/views/Method.vue";
import Help from "@/views/Help.vue";
// import Functions from "@/views/Function.vue";

const routes = [
  {
    isBar:true,//如果不想加入TopBar，就设定为false，或者写在对应children里面
    path: "/",
    name: "首页",
    component: Home,
    children:[]
  },
  {
    isBar:true,
    path: "/model",
    name: "模型",
    component: Model,
    children:[]
  },
  {
    isBar:true,
    path: "/case",
    name: "案例",
    component: Method,
    children:[]
  },
  
  {
    isBar:true,
    path: "/about",
    name: "关于",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
      children:[]
  },
  {
    isBar:true,
    path: "/test",
    name: "测试",
    component: Help,
    children:[]
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
