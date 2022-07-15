<template>
  <img :id="chartId" style="width: 100%; height: 100%" :src="imgPath">
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import { onMounted } from "vue";
export default {
  name: "chartWithPng",
  props: {
    imgPath: String,
    chartId: String,
  },
  setup(props, ctx) {
    onMounted(() => {
      // 需要获取到element,所以是onMounted的Hook

    });
  },
};
</script>

<style>
</style>