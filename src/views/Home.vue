<template>
  <div class="about">
    <div style="position:absolute;top:0px;left:0;"><h1>This is a home page</h1></div>
    <Fire></Fire>


  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import Fire from "@/components/Home/Fire.vue"

const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit

</script>

<style lang="less" scoped>
// 兼容css

</style>

