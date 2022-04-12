
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
<template>
  <div id="app" class="">
    <Topbar @RouterFromBar="routerGo" style="height: 60px"></Topbar>

    <router-view class="main"></router-view>
  </div>
</template>
<style lang="less" scoped>
// @import "./css/mouse/fire.css";
// @import url(https://fonts.googleapis.com/css?family=Amatic+SC);

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #fafafa;
  background-color: #646464;
  // cursor: ;
}
.main {
  position: relative;
  top: 0;
  left: 0;
  height: 857px;
}
</style>
