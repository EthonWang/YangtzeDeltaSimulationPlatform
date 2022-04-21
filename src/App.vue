

<template>
  <div id="app" class="">
    <Topbar
      @RouterFromBar="routerGo"
      style="height: 60px; position: absolute; z-index: 500"
    ></Topbar>

    <router-view class="main"></router-view>
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
  myRouter.push({ path: router });
};
// window.onload=function(){document.getElementsByClassName("main")[0].height=window.innerHeight}
</script>
<style lang="less">
// @import "./css/mouse/fire.css";
// @import url(https://fonts.googleapis.com/css?family=Amatic+SC);
@import "./css/global/cyberpunk.less";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow: hidden;
  width: 1920px;
  color: #000000;
  margin-left: -3.8px;
  margin-top: -8px;
  padding-left: 0px;
  // margin-right: -8px;
  background: #63c4fd;
  
}
.main {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 930px;
  padding-top: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 1px !important;
}
</style>
