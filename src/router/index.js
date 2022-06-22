import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// import Data from "@/views/Data.vue";
import Model from "@/views/Model.vue";
import Cases from "@/views/Cases.vue";
import Help from "@/views/Help.vue";
// import Functions from "@/views/Function.vue";
import ModelConfig from "@/components/App/ModelConfig"
import { cases_config } from "@/assets/config/cases.config";
import newResource from "@/components/resource/newResource.vue"

const routes = [
  {
    isBar: true,//如果不想加入TopBar，就设定为false，或者写在对应children里面
    path: "/",
    name: "首页",
    component: Home,
    children: []
  },
  {
    isBar: true,
    path: "/themetic",
    name: "专题",
    component: () => import("../views/Themetic.vue"),
    children: []
  },
  {
    isBar: true,
    path: "/resourse",
    name: "资源",
    component: () => import("../views/Resourse.vue"),
    children: []
  },
  {
    isBar: false,
    path: "/model",
    name: "模型",
    component: Model,
    children: []
  },
  {
    isBar: false,
    path: "/case",
    name: "案例",
    component: Cases,
    children: [
      {
        path: "",
        name: "案例的家",
        component: () => import("../views/CasesView/CasesHome.vue")
      },
    ]
  },
  {
    isBar: false,
    path: "/about",
    name: "关于",
    component: () =>
      import("../views/About.vue"),
    children: []
  },
  {
    isBar: false,
    path: "/test",
    name: "测试",
    component: Help,
    children: []
  },
  {
    isBar: false,
    path: "/modelConfig",
    name: "ModelConfig",
    component: ModelConfig,
    children: []
  },
  {
    isBar: true,
    path: "/user",
    name: "实验室",
    component: () =>
      import("../views/User.vue"),
    children: [
      {
        isBar: false,
        path: '',
        name: '概览',
        component: () =>
          import("@/components/User/UserFunctionCollection/Overview.vue")
      },
      {
        isBar: false,
        path: 'data',
        name: '数据中心',
        component: () =>
          import("@/components/User/UserFunctionCollection/DataCenter.vue")
      },
      {
        isBar: false,
        path: 'model',
        name: '模型中心',
        component: () =>
          import("@/components/User/UserFunctionCollection/ModelCenter.vue")
      },
      {
        isBar: false,
        path: 'task',
        name: '任务中心',
        component: () =>
          import("@/components/User/UserFunctionCollection/TaskCenter.vue")
      },
    ]
  },
  {
    isBar: false,
    path: "/login",
    name: "登录",
    component: () =>
      import("../views/Login.vue"),
    children: []
  },
  {
    isBar: false,
    path: "/register",
    name: "注册",
    component: () =>
      import("../views/Register.vue"),
    children: []
  },
  {
    isBar: false,
    path: '/newResource',
    name: '添加资源',
    component: newResource,
  },
];
class base_route {
  isBar = false
  path = '';
  name = '';
  component = null;
  children = [];
}
routes[4].children = routes[4].children.concat(cases_config)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
