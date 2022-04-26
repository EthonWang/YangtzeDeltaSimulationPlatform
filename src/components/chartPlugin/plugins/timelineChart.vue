<template>
  <div id="timelineChart" style="width: 100%; height: 100%"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import { onMounted } from "vue";
import { dataList } from "./test";
export default {
  name: "timelineChart",
  props: {
    date: String,
  },
  emits: ["closeChart"],
  setup(props, ctx) {
    onMounted(() => {
      // 需要获取到element,所以是onMounted的Hook
      let myChart = echarts.init(document.getElementById("timelineChart"));
      // 绘制图表
      let base = +new Date(1967, 0, 1);
      let oneDay = 24 * 3600 * 1000;
      let data = [[base, dataList[0]]];
      for (let i = 1; i < dataList.length; i++) {
        let now = new Date((base += oneDay));
        data.push([+now, dataList[i]]);
      }
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        // title: {
        //   left: "center",
        //   text: "Large Ara Chart",
        // },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 20,
          },
          {
            start: 0,
            end: 20,
          },
        ],
        series: [
          {
            name: "Observed Flow(m3/s)",
            type: "line",
            smooth: true,
            symbol: "none",
            areaStyle: {},
            data: data,
          },
        ],
      });
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