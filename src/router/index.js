import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// import Data from "@/views/Data.vue";
import Model from "@/views/Model.vue";
import Cases from "@/views/Cases.vue";
import Help from "@/views/Help.vue";
// import Functions from "@/views/Function.vue";
import ModelConfig from "@/components/App/ModelConfig"
import { cases_config } from "@/assets/config/cases.config";

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
    path: "/themetic",
    name: "专题",
    component:() => import( "../views/Themetic.vue"),
    children:[]
  },
  {
    isBar:true,
    path: "/resourse",
    name: "资源",
    component:() => import( "../views/Resourse.vue"),
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
    component: Cases,
    children:[
      {
        path:"",
        name:"案例的家",
        component:() => import( "../views/CasesView/CasesHome.vue")
      },
    ]
  },
  {
    isBar:true,
    path: "/about",
    name: "关于",
    component: () =>
      import("../views/About.vue"),
      children:[]
  },
  {
    isBar:true,
    path: "/test",
    name: "测试",
    component: Help,
    children:[]
  },
  {
    isBar:false,
    path: "/modelConfig",
    name: "ModelConfig",
    component: ModelConfig,
    children:[]
  },
  {
    isBar:false,
    path: "/user",
    name: "用户",
    component: () =>
    import("../views/User.vue"),
    children:[]
  },

];
class base_route{
  isBar=false
  path='';
  name='';
  component=null;
  children=[];
}
routes[4].children=routes[4].children.concat(cases_config)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
