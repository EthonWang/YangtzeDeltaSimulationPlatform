<template>
  <div style="height: 100%; width: 100%">
    <ModelItem
      v-for="model in models"
      :key="model"
      :model="model"
      style="height: fit-content; width: 100%"
    ></ModelItem>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ModelItem from "./ModelItem.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const models = reactive([
  {
    name: "SWMM模型（Storm Water Management Model）",
    description:
      "SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    author: "NNU",
    tag: [""],
  },
    {
    name: "SWMM模型（Storm Water Management Model）",
    description:
      "SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    author: "NNU",
    tag: [""],
  },
]);
</script>

<style lang="less" scoped>
// 兼容css
</style>

