<template>
  <div id="map"></div>
  <el-card shadow="always" class="info-title">
    <h1>长三角区域风场模拟</h1>
  </el-card>
  <el-card shadow="always" class="info-card">
    <el-scrollbar max-height="20vh" style="width: 100%">
      <div class="slider-demo-block" style="width: 90%; margin-left: 10px">
        <span class="demonstration"><strong>时间轴</strong></span>
        <span class="demonstration" style="float: right"
          >当前时间：{{ converTime }}</span
        >
        <el-slider v-model="dateNum" :max="1459" @change="sliderChangePic" style="width: 90%;" />
      </div>
      <div class="info-button-box">
        <ButtonGroup class="info-buttonGroup">
          <Button type="primary" @click="btngoback()">
            <Icon type="ios-arrow-back"></Icon>
            向前
          </Button>
          <Button type="primary" @click="btngoplay()" v-if="!btnIsPlay">
            <Icon type="ios-play-outline"></Icon>
            播放
          </Button>
          <Button type="primary" @click="btngoplay()" v-else>
            <Icon type="ios-pause-outline"></Icon>
            暂停
          </Button>
          <Button type="primary" @click="btngoforward()">
            向后
            <Icon type="ios-arrow-forward"></Icon>
          </Button>
        </ButtonGroup>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "App",
};
</script>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { FlowLayer } from "./customLayers/FlowLayer";
import { getMap } from "./customLayers/mapSetting";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ElMessage } from "element-plus";

let map = null;
const dataServer = useStore().state.devIpAddress;
const flowImageURL = dataServer + "/store/textures/2017010106.png";
let dateNum = ref(0);
let btnIsPlay = ref(false);
let picPlayer = ref(null);
const paint = ref<HTMLCanvasElement | null>(null);
mapboxgl.accessToken =
  "pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNsMWVsdnpxNDBzcDgzYnA0MDJrcW1hOXQifQ.-5KUoc4jAJbAcBEWgbMGSA";

type FlowParams = {
  pixelRate: number;
  speedFactor: number;
  dropRate: number;
  fadeOpacity: number;
  mainOpacity: number;
  dropRateBump: number;
  lineNum: number;
};
const sliderChangePic = function () {
  beforeAddTsImg();
};
const btngoback = function () {
  if (dateNum.value > 0) {
    dateNum.value = dateNum.value - 1;
    this.beforeAddTsImg();
  } else {
    ElMessage({
      message: "已经是第一张",
      type: "warning",
    });
  }
};
const btngoplay = function () {
  if (btnIsPlay.value) {
    //正在播放
    btnIsPlay.value = false;
    clearInterval(picPlayer.value);
  } else {
    //未播放
    btnIsPlay.value = true;
    let that = this;
    picPlayer.value = setInterval(() => {
      that.btngoforward();
    }, 5500);
  }
};
const btngoforward = function () {
  if (dateNum.value < 1459) {
    dateNum.value = dateNum.value + 1;
    this.beforeAddTsImg();
  } else {
    ElMessage({
      message: "已经是最后一张",
      type: "warning",
    });
    if (btnIsPlay.value) {
      btnIsPlay.value = false;
      clearInterval(picPlayer.value);
    }
  }
};
const beforeAddTsImg = function () {
  map.removeLayer("flow");
  //   map.removeSource("tsimg_01");
  let timeString = computedTime();
  let url = dataServer + "/store/textures/" +timeString +".png";
  addUVAnimation(url);
};
const addUVAnimation = function (url) {
  const partLayer = new FlowLayer(
    "flow",
    "2d",
    url,
    7,
    [69.75, 14.5, 140.5, 55.25]
  );

  const layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style.
  let firstSymbolId = "";
  for (const layer of layers) {
    if (layer.type === "symbol") {
      firstSymbolId = layer.id;
      break;
    }
  }
  map.addLayer(partLayer, firstSymbolId); // add flow layer before symbols layer
};
const computedTime = function(){
  let startTimeString = "2017-1-1 6:00:00";
  let time = new Date(startTimeString);
  let newDate = time.setHours(time.getHours() + dateNum.value * 6);
  let newTime = new Date(newDate);
  let year = newTime.getFullYear().toString();
  let month = (newTime.getMonth() + 1);
  let date = newTime.getDate();
  let hours = newTime.getHours();
  if(month < 10){
    year = year + "0" + month.toString();
  } else {
    year = year + month.toString();
  }
  if(date < 10){
    year = year + "0" + date.toString();
  } else {
    year = year + date.toString();
  }
  if(hours < 10){
    year = year + "0" + hours.toString();
  } else {
    year = year + hours.toString();
  }
  return year
};
const converTime = computed(() => {
  let startTimeString = "2017-1-1 6:00:00";
  let time = new Date(startTimeString);
  let newDate = time.setHours(time.getHours() + dateNum.value * 6);
  let newTime = new Date(newDate);
  return (
    newTime.getFullYear() +
    "-" +
    (newTime.getMonth() + 1) +
    "-" +
    newTime.getDate() +
    " " +
    newTime.getHours() +
    ":00:00"
  );
});
onMounted(async () => {
  console.log("Mounted...");
  map = getMap(
    "pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNsMWVsdnpxNDBzcDgzYnA0MDJrcW1hOXQifQ.-5KUoc4jAJbAcBEWgbMGSA",
    {
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10", // style URL
      center: [118.800697, 32.064162], // starting position [lng, lat]
      zoom: 3,
    }
  );

  const partLayer = new FlowLayer(
    "flow",
    "2d",
    flowImageURL,
    7,
    [69.75, 14.5, 140.5, 55.25]
  );

  map.on("load", () => {
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId = "";
    for (const layer of layers) {
      if (layer.type === "symbol") {
        firstSymbolId = layer.id;
        break;
      }
    }
    map.addLayer(partLayer, firstSymbolId); // add flow layer before symbols layer
  });
});
</script>

<style lang="less" scoped>
body {
  margin: 0;
}
.info-title {
  position: absolute;
  left: 20px;
  top: 20px;
  opacity: 0.8;
}
#map {
  margin: 0;
  width: 100vw;
  height: 93vh;
}
.info-card {
  position: absolute;
  left: 20px;
  bottom: 25px;
  width: 25%;
  height: 15vh;
  opacity: 0.9;
}
.info-button-box {
  width: 100%;
}
.info-buttonGroup {
  margin-top: 10px;
}
/deep/ .slider-demo-block{
  display: none;
}
</style>
