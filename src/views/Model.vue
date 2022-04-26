<template>
  <div class="about">
    <button class="mapSwitchButton" @click="switchMap">2D/3D</button>
    <mapbox-view
      :shpShowList="shpList"
      v-if="mapType == 'mapBox'"
    ></mapbox-view>
    <cesium v-if="mapType == 'cesium'" />
    
    <!-- echarts图表 -->
    <div v-for="item in chartList" :key="item.id">
      <chart-template
        style="z-index: 1000"
        v-if="item.type == 'chart' && item.isShow"
        :date="item.chartDate"
        @closeChart="closeChart"
      />
    </div>
  </div>
</template>

<!--<script setup>-->
<script>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MapboxView from "../components/Mapbox/MapboxView";
import Cesium from "../components/cesium/cesium.vue";
import chartTemplate from "../components/chartPlugin/chartTemplate.vue";
export default {
  components: {
    MapboxView,
    Cesium,
    chartTemplate,
    // timelineChart,
    // rainfallAndFlowRelationshipChart,
  },
  data() {
    return {
      mapType: "mapBox",
      //使用mapbox-view组件需要传递的参数
      shpList: [], //格式参考[{name: "111", type: "circle", nameId: "111_123"}]
      //使用chart组件需要传递的参数
      fileDate: "null",
      chartList: [
        {
          rid: "111",
          type: "chart",
          isShow: true,
          chartDate: {
            id: '111',
            chartType: "stackedLine2",
            chartName: "Tmp",
            time: [],
            date: [],
          },
        },
        {
          rid: "222",
          type: "chart",
          isShow: true,
          chartDate: {
            id: '222',
            chartType: "stackedLine1",
            chartName: "Pcp",
            time: [],
            date1: [],
            date2: [],
          },
        },
      ],
    };
  },
  methods: {
    switchMap() {
      if (this.mapType == "mapBox") {
        this.mapType = "cesium";
      } else {
        this.mapType = "mapBox";
      }
    },
    closeChart(value) {
      for(let i = 0 ; i < this.chartList.length ; i++){
        if(this.chartList[i].rid == value){
          this.chartList[i].isShow = this.chartList[i].isShow ? false : true;
        }
      }
    },
  },
};
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
</script>

<style lang="less" scoped>
// 兼容css
.about {
  position: relative;
}
.mapSwitchButton {
  position: absolute;
  bottom: 250px;
  right: 10px;
  z-index: 1000;
}
</style>

