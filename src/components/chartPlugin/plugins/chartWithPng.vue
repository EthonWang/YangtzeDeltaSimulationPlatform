<template>
  <div style="position: absolute; top: 32px; right: 3px">
    <Icon
      type="ios-download-outline"
      size="24"
      style="cursor: pointer; margin-left: 2px"
      title="保存为图片"
      @click="downloadPng()"
    />
  </div>
  <img
    :id="chartId"
    style="width: 98%; height: 98%; margin-top: 2px"
    :src="imgPath"
  />
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
    const downloadPng = function () {
      ctx.emit("downloadPic", props.imgPath);
    };
    return {
      downloadPng,
    };
  },
};
</script>

<style>
</style>