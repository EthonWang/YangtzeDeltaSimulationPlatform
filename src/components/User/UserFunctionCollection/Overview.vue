<!-- ·主题：个人空间概览 -->
<!-- ·设计人：张子卓 -->
<!-- ·功能 -->
<!-- 介绍个人实验室（个人空间） -->
<template>
  <div class="about">
    <div style="height: 100%; width: 100%; text-align: center">
      <div style="margin: 3%"></div>
    
      <img height="56" width="56" src="@/assets/earth_global.svg" alt="" />
      <div style="margin: 1.5vh"></div>
      <h1>开始您的长三角模拟实验</h1>
      <div style="margin: 1.5vh"></div>
      <p style="font-size: 20px; color: #646464">
        基于数据、模型、地图，进行您的科研活动
      </p>
      <div style="margin: 3.5vh"></div>
      <IntroduceVue
        :picture="introduce"
        style="width: 100%; height: 60vh"
      ></IntroduceVue>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import IntroduceVue from "@/components/App/Introduce.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const introduce = ref([
  require("assets/introduce/myspace.png"),
  require("assets/introduce/dataspace.png"),
  require("assets/introduce/modelspace.png"),
]);
</script>

<style lang="less" scoped>
// 兼容css

h1 {
  font-weight: 500;
  font-size: 23px;
  // color: #646464;
}
.cls-1 {
  fill: #79b8ff;
}
.cls-2 {
  fill: #2088ff;
}
.cls-3 {
  fill: none;
}
</style>

