<template>
  <div>
    <div ref="relationship" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import { echarts_data } from "assets/data/home/echarts";
import { relation } from "@/assets/data/another/relation";

const relationship = ref();
const graph = relation;
// onMounted(() => {
//   init();
// });
setTimeout(init, 1000);
function init() {
  const myChart = echarts.init(relationship.value);

  let option = {
    tooltip: {},
    color:['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',"hsl(195,95%,45%)","hsl(120,100%,40%)","hsl(80,90%,50%)","hsl(50,90%,50%)"],
    legend: [
      {
        data: graph.categories.map(function (a) {
          return a.name;
        }),
      },
    ],
    series: [
      {
        name: "长三角综合模拟图谱",
        type: "graph",
        layout: "force",
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        draggable:true,
        edgeSymbol: ['', 'arrow'],
        edgeSymbolSize : 10,
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
        },
        labelLayout: {
          hideOverlap: true,
        },
        scaleLimit: {
          min: 0.4,
          max: 2,
        },
        lineStyle: {
          color: "source",
          curveness: 0.3,
        },
        force: {
          repulsion: 3000
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 5
          }
        },
      },
    ],
  };
  option && myChart.setOption(option);
  myChart.on("click", (params) => {
    console.log(params.data,params.seriesName);
  });
}
</script>

<style lang="less" scoped>
</style>