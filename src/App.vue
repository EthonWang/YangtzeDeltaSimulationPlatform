

<template>
  <div id="app" class="">
    <Topbar
      :background_show="background_show"
      @RouterFromBar="routerGo"
      style="height: 65px; position: absolute; z-index: 500; overflow: hidden"
    ></Topbar>

    <router-view
      @showTopbarBackground="showTopbarBackground"
      class="main"
    ></router-view>
    <el-button
      v-if="route.path.includes('/case/')"
      class="btnback"
      style=""
      @click="myRouter.go(-1)"
    >
      <el-icon><Back /></el-icon>&nbsp;返回
    </el-button>
    <!-- </el-scrollbar> -->
    <!-- <div> OPENGMS</div> -->
  </div>
</template>
<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import Topbar from "./components/App/Topbar.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const background_show = ref(false);
const route = useRoute();
const showTopbarBackground = (bool) => {
  background_show.value = bool;
};
const myRouter = useRouter();
const routerGo = (router) => {
  myRouter.push({ path: router });
};
// window.onload=function(){document.getElementsByClassName("main")[0].height=window.innerHeight}
</script>
<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: fit-content;
  overflow: hidden;
  color: #000000;
  // margin: -8px;
  // margin-top: -8px;
  // margin-left: -8px;
  // margin-right: -8px;
  // background: #24292f;
  background: hsl(220, 100%, 5%);
}
.btnback {
  position: fixed;
  top: 65px;
  right: -45px;
  z-index: 9999;
  opacity: 0.75;
  &:hover {
    right: 0;
    opacity: 1;
  }
}
.main {
  position: relative;
  top: 0;
  left: 0;
  height: 100vh;
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
