

<template>
  <div id="app" class="">
    <Topbar
      @RouterFromBar="routerGo"
      style="height: 60px; position: absolute; z-index: 500"
    ></Topbar>
    <!-- <el-scrollbar height="400px" -->
      ><router-view class="main"></router-view
    >
    <!-- </el-scrollbar> -->
  </div>
</template>
<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import Topbar from "./components/App/Topbar.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const myRouter = useRouter();
const routerGo = (router) => {
  console.log(router);
  myRouter.push({ path: router });
};
</script>
<style lang="less" scoped>
// @import "./css/mouse/fire.css";
// @import url(https://fonts.googleapis.com/css?family=Amatic+SC);

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #fafafa;
  // background-color: #646464;
  // cursor: ;
}
.main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 857px;
  padding-top: 60px;
  overflow-y: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar{
  width: 1px !important;
}
</style>
