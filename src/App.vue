
<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import Topbar from "./components/Topbar/Topbar.vue"
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const myRouter=useRouter()
const routerGo=(router)=>{
  console.log(router)
myRouter.push({path:router})
}

</script>
<template>
  <div id="app">
    <Topbar @RouterFromBar="routerGo" style="height:60px"></Topbar>
  
  <router-view />
  </div>
</template>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
