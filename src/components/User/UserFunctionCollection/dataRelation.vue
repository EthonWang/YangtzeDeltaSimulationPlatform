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
setTimeout(init,500)
function init() {
  const city = [3291, 3307, 3289, 3292, 3263];

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
        layout: "none",
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
      },
    ],
  };
  option && myChart.setOption(option);
}
</script>

<style lang="less" scoped>
</style>