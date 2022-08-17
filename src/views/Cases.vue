<template>
  <div class="about">
    <!-- <span class="color-change"></span> -->
    <div class="cases-page">
        <router-view style="width: 100%; height: 100%"></router-view>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import OneCase from "components/Cases/OneCase.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
</script>

<style lang="less" scoped>
.color-change {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6.5vh;
  background: black;
  animation: hiding 0.5s linear forwards 0s;
  z-index: 15;
  @keyframes hiding {
    0% {
    }
    100% {
      height: 0;
      background: rgb(0, 0, 0);
    }
  }
}
.cases-page {
  position: absolute;
  top: 65px;
  left: 0px;
  height: calc(100vh - $top);
  width: calc(100% - $left);
  background-color: white;
  overflow-x: hidden;
}
.about{
  overflow: hidden;
}
</style>

