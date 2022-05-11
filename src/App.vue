

<template>
  <div id="app" class="">
    <Topbar
    :background_show="background_show"
      @RouterFromBar="routerGo"
      style="height: 6.39vh; position: absolute; z-index: 500"
    ></Topbar>

    <router-view @showTopbarBackground="showTopbarBackground" class="main"></router-view>
    <!-- </el-scrollbar> -->
  </div>
</template>
<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import Topbar from "./components/App/Topbar.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const background_show=ref(false)
const showTopbarBackground=(bool)=>{
  background_show.value=bool
}
const myRouter = useRouter();
const routerGo = (router) => {
  myRouter.push({ path: router });
};
// window.onload=function(){document.getElementsByClassName("main")[0].height=window.innerHeight}
</script>
<style lang="less">

@import "./css/global/cyberpunk.less";

#app {

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow: hidden;
  color: #000000;
  margin: -8px;
  // margin-top: -8px;
  // margin-left: -8px;
  // margin-right: -8px;
  background: #202020;
  
}
.main {
  position: relative;
  top: 0;
  left: 0;
  height: 101.5vh;
  // height: 950px;
  padding-top: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  // font-family: pingfangh;
}
::-webkit-scrollbar {
  width: 0px !important;
}
</style>
