<template>
  <div :id="chartId" style="width: 100%; height: 100%"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import { onMounted } from "vue";
export default {
  name: "chartWithoutOptions",
  props: {
    chartOptions: {
        type: Object
    },
    chartId: String,
  },
  setup(props, ctx) {
    onMounted(() => {
      // 需要获取到element,所以是onMounted的Hook
      let myChart = echarts.init(
        document.getElementById(props.chartId)
      );
      // 绘制图表
      setTimeout(function () {
        myChart.setOption(props.chartOptions);
      }, 500);

      window.onresize = function () {
        // 自适应大小
        myChart.resize();
      };
    });
  },
};
</script>

<style>
</style>