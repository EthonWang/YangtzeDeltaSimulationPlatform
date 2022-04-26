<template>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div
    v-dragMove="{
      DragButton: '.window-header',
      DragVindow: '.window',
      custom: true,
    }"
  >
    <div class="window">
      <div class="window-header">
        {{ data.label }}
        <button class="window-header-close" @click="closeWindow" title="close">
          X
        </button>
      </div>
      <div class="window-body">
        <chart-without-options
          :chartOptions="chartOptions"
          :chartId="data.dataSourceId"
          v-if=" data.mapDataType == 'chart'"
        />
        <!-- <timeline-chart v-if="data.chartType == 'singleWithTimeline'"/>
          <rainfall-and-flow-relationship-chart v-if="data.chartType == 'doubleWithTimeline'"/>
          <stacked-line v-if="data.chartType == 'stackedLine2'"/>
          <stacked-line1 v-if="data.chartType == 'stackedLine1'"/> -->
        <!-- 后续新图表样式往后补充... -->
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import chartWithoutOptions from "./plugins/chartWithoutOptin.vue";
import axios from "axios";
// import timelineChart from "./plugins/timelineChart.vue";
// import rainfallAndFlowRelationshipChart from "./plugins/rainfallAndFlowRelationshipChart.vue";
// import stackedLine from "./plugins/stackedLine.vue";
// import stackedLine1 from "./plugins/stackLine1.vue";

export default {
  name: "chartTemplate",
  props: {
    data: Object,
  },
  components: {
    chartWithoutOptions,
    // timelineChart,
    // rainfallAndFlowRelationshipChart,
    // stackedLine,
    // stackedLine1
  },
  emits: ["closeChart"],
  setup(props, ctx) {
    let chartOptions = ref({});
    let getFinished = false;
    const getChartData = () => {
      axios
        .get(
          "http://172.21.212.63:8999/model/getVisualData?visualDataPath=" +
            props.data.path
        )
        .then((res) => {
          chartOptions.value = res.data.data;
        //   console.log("chartOptions", chartOptions.value);
          getFinished = true;
        });
    };
    getChartData();
    onMounted(() => {
    });
    const closeWindow = function () {
      ctx.emit("closeChart", props.data.dataSourceId);
    };
    return {
      closeWindow,
      chartOptions,
      getFinished
    };
  },
};
</script>

<style>
.window {
  width: 600px;
  height: 400px;
  border: 1px solid #cccccc;
  position: absolute;
  background: #e8eef9;
  opacity: 0.9;
}
.window-header {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  text-align: left;
  background: #beceeb;
  user-select: none;
}
.window-header-close {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
  height: 20px;
}
.window-body {
  height: 370px;
  width: 600px;
}
</style>