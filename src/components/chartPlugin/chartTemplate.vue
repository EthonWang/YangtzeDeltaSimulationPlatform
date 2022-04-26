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
        {{ date.chartName }}
        <button class="window-header-close" @click="closeWindow" title="close">
          X
        </button>
      </div>
      <div class="window-body">
          <timeline-chart v-if="date.chartType == 'singleWithTimeline'"/>
          <rainfall-and-flow-relationship-chart v-if="date.chartType == 'doubleWithTimeline'"/>
          <stacked-line v-if="date.chartType == 'stackedLine2'"/>
          <stacked-line1 v-if="date.chartType == 'stackedLine1'"/>
          <!-- 后续新图表样式往后补充... -->
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import timelineChart from "./plugins/timelineChart.vue";
import rainfallAndFlowRelationshipChart from "./plugins/rainfallAndFlowRelationshipChart.vue";
import stackedLine from "./plugins/stackedLine.vue";
import stackedLine1 from "./plugins/stackLine1.vue";

export default {
  name: "chartTemplate",
  props: {
    date: Object,
  },
  components: {
    timelineChart,
    rainfallAndFlowRelationshipChart,
    stackedLine,
    stackedLine1
  },
  emits: ["closeChart"],
  setup(props, ctx) {
    onMounted(() => {
      console.log(props.date);
    });
    const closeWindow = function () {
      ctx.emit("closeChart", props.date.id);
    };
    return {
      closeWindow,
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