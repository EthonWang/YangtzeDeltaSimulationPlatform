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
setTimeout(init, 500);
function init() {
  const myChart = echarts.init(relationship.value);

  let option = {
    tooltip: {},
    legend: [
      {
        data: graph.categories.map(function (a) {
          return a.name;
        }),
      },
    ],
    series: [
      {
        name: "Les Miserables",
        type: "graph",
        layout: "force",
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
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
          repulsion: 950
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