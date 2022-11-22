<template>
  <div id="map1">
    <div class="info-card">
      <el-card shadow="always" class="chart-card">
        <div id="chart">点击图中数据点查看水位变化</div>
      </el-card>
      <el-card shadow="always" class="play-card">
        <div class="slider-demo-block">
          <span class="demonstration"><strong>时间轴</strong></span>
          <span class="demonstration" style="float: right"
            >当前时间：{{ converTime }}</span
          >
          <el-slider
            v-model="dateNum"
            :max="145"
            @change="sliderChangePic"
            style="width: 100%"
          />
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
      </el-card>
    </div>
    <div class="water_depth_color" style="z-index: 5">
      <div class="color-bar">
        <div class="color">
          <div class="color-item" style="background-color: #c8e020"></div>
          <div class="color-item" style="background-color: #5ec962"></div>
          <div class="color-item" style="background-color: #28ae80"></div>
          <div class="color-item" style="background-color: #1f9a8a"></div>
          <div class="color-item" style="background-color: #24868e"></div>
          <div class="color-item" style="background-color: #2c728e"></div>
          <div class="color-item" style="background-color: #3b528b"></div>
          <div class="color-item" style="background-color: #481f70"></div>
        </div>
        <div class="label">
          <div class="color-item" style="text-align: left">3.0</div>
          <div class="color-item" style="text-align: left">2.0</div>
          <div class="color-item" style="text-align: left">1.0</div>
          <div class="color-item" style="text-align: left">0.5</div>
          <div class="color-item" style="text-align: left">0.0</div>
          <div class="color-item" style="text-align: left">-0.5</div>
          <div class="color-item" style="text-align: left">-1.0</div>
          <div class="color-item" style="text-align: left">-2.0</div>
          <div class="color-item" style="text-align: left">-3.0</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { ElMessage } from "element-plus";
import * as echarts from "echarts";
import GeoJSON from "ol/format/GeoJSON";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
// import * as olProj from "ol/proj";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj.js";
import VectorLayer from "ol/layer/VectorImage";
import VectorSource from "ol/source/Vector";
import { Image } from "ol/layer";
import { Map, View, Overlay, Feature } from "ol";
import { ImageStatic } from "ol/source";
import * as proj from "ol/proj";
// import * as ol from "ol";
// import "@/assets/olext.js";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Text } from "ol/style";
// import ImageLayer from 'node_modules/_ol@7.1.0@ol/layer/Image';
// import { ref } from "vue";
// import { Encrypt, Decrypt } from "@/util/codeUtil";
// import Api from "@/api/user/task";
// import Sortable from "sortablejs";
// import imgurl from "../../public/test_cvt.png";
var map = null;
export default {
  name: "StormSurgeWater",
  data() {
    return {
      zoom: null,
      showCenter: null,
      openmap: null,
      key: "3bb0fffc32732aaaddcf078379682d61",
      index: 0,
      imgurl: null,
      pnglayer: null,
      imgsource: null,
      pointlayer: null,
      pointsource: null,
      pointstyle: null,
      hovered: null,
      allLayers: null,
      FID: 1,
      feature_click: null,
      dateNum: 0,
      picPlayer: null,
      btnIsPlay: false,
    };
  },
  methods: {
    initmap() {
      this.tilelayer = new TileLayer({
        source: new XYZ({
          url: "https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGFycnk2MjkiLCJhIjoiY2w5d2o3MGMxMDEzbDNubzVncmduNDJhMyJ9.Pl2vzQk9AbJ7aX064gQs6Q",
          // "http://t3.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" +
          // this.key,
          //   attributions: attributions,
          // crossOrigin: "anonymous",
          // tileSize: 512,
        }),
      });
      // let newlayer = new TileLayer({
      //   source: new XYZ({
      //     url:
      //       "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" +
      //       this.key,
      //     //   attributions: attributions,
      //     crossOrigin: "anonymous",
      //     tileSize: 512,
      //   }),
      // });
      (this.pointstyle = {
        symbol: {
          symbolType: "circle",
          size: ["interpolate", ["exponential", 2.5], ["zoom"], 2, 1, 14, 32],
          color: ["match", ["get", "hover"], 1, "#ff3f3f", "#bfa"],
          offset: [0, 0],
          opacity: 0.95,
        },
      }),
        (this.pointsource = new VectorSource({
          url: "/case/point.json",
          format: new GeoJSON(),
          wrapX: true,
        }));
      this.pointlayer = new WebGLPointsLayer({
        // background: "#1a2b39",
        source: this.pointsource,
        style: this.pointstyle,
      });
      this.imgurl = "/case/png/test_t_0_cvt.png";
      this.imgsource = new ImageStatic({
        url: this.imgurl, //地址
        projection: "EPSG:4326",
        imageExtent: [119.182854, 27.166469, 123.360253, 35.375766],
      });
      this.pnglayer = new Image({
        source: this.imgsource,
      });
      this.openmap = new Map({
        target: "map1",
        layers: [this.tilelayer, this.pnglayer, this.pointlayer],
        // layers: [this.tilelayer],
        view: new View({
          center: fromLonLat([120.583905, 31.313832]),
          zoom: 8,
        }),
      });
      let that = this;
      this.openmap.on("pointermove", function (ev) {
        if (that.hovered !== null) {
          that.hovered.set("hover", 0);
          that.hovered = null;
          that.openmap.getViewport().style.cursor = "pointer";
        } else {
          that.openmap.getViewport().style.cursor = "inherit";
          that.openmap.forEachFeatureAtPixel(ev.pixel, function (feature) {
            // console.log(feature);
            feature.set("hover", 1);
            that.hovered = feature;
            return true;
          });
        }
      });
      this.singleclick();
    },
    // autoChange() {
    //   setInterval(() => {
    //     this.changeRainDay();
    //   }, 2000);
    // },
    // changeRainDay() {
    //   // this.openmap.removeLayer("rainImgLayer");
    //   // this.openmap.removeSource("rainImgSource");
    //   this.allLayers = this.openmap.getLayers();
    //   this.index = (this.index + 1) % 144;
    //   this.imgurl = "/png/test_t_" + this.index + "_cvt.png";
    //   this.openmap.removeLayer(this.pnglayer);
    //   // this.imgurl = "/png/test_t_0_cvt.png";
    //   this.imgsource = new ImageStatic({
    //     url: this.imgurl, //地址
    //     projection: "EPSG:4326",
    //     imageExtent: [119.182854, 27.166469, 123.360253, 35.375766],
    //   });
    //   this.pnglayer = new Image({
    //     source: this.imgsource,
    //   });
    //   // this.openmap.addLayer(this.pnglayer, 3);
    //   this.allLayers.insertAt(1, this.pnglayer);
    //   // map.addSource("rainImgSource", {
    //   //   type: "image",
    //   //   url: imgUrl,
    //   //   coordinates: [
    //   //     [114.8, 35.1],
    //   //     [122.8, 35.1],
    //   //     [122.8, 27.1],
    //   //     [114.8, 27.1],
    //   //   ],
    //   // });
    //   // map.addLayer(
    //   //   {
    //   //     id: "rainImgLayer",
    //   //     source: "rainImgSource",
    //   //     type: "raster",
    //   //     paint: { "raster-opacity": 0.85 },
    //   //   },
    //   //   "rainStationLayer"
    //   // );
    // },
    initchart() {
      let chartDom = document.getElementById("chart");
      let myChart = echarts.init(chartDom);
      let option;
      let base = +new Date(2021, 7, 16, 20, 0, 0);
      // let oneDay = 24 * 3600 * 1000;
      let oneHour = 3600 * 1000;
      // let valueBase = Math.random() * 300;
      let valueBase2 = Math.random() * 50;
      let data = [];
      let data2 = [];
      for (var i = 0; i < 145; i++) {
        // console.log(i);
        var now = new Date((base += oneHour));
        var dayStr = [
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
          // now.getHours(),
          // now.getMinutes(),
          // now.getSeconds(),
        ].join("-");
        var hms = [now.getHours(), now.getMinutes(), now.getSeconds()].join(
          ":"
        );
        var time = dayStr + " " + hms;
        let valueBase = this.feature_click.get("z" + i);
        // valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
        // valueBase <= 0 && (valueBase = Math.random() * 300);
        data.push([time, valueBase]);
      }
      option = {
        title: {
          left: "center",
          text: "风暴潮水位",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765",
            },
          },
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 10,
            end: 20,
          },
          {
            type: "inside",
            realtime: true,
            start: 10,
            end: 20,
          },
        ],
        xAxis: {
          type: "category",
          name: "时间",
          // axisLine: { onZero: false },
          // data: _this.FS_result.times,
        },
        yAxis: {
          type: "value",
          name: "水位（m）",
        },
        series: [
          {
            // data: _this.FS_result.values,
            type: "line",
            data: data,
          },
        ],
      };

      // option = {
      //   title: {
      //     left: "center",
      //     text: "水位",
      //   },
      //   legend: {
      //     top: "bottom",
      //     data: ["Intention"],
      //   },
      //   // tooltip: {
      //   //   triggerOn: "none",
      //   //   position: function (pt) {
      //   //     return [pt[0], 130];
      //   //   },
      //   // },
      //   // toolbox: {
      //   //   left: "center",
      //   //   itemSize: 25,
      //   //   top: 55,
      //   //   feature: {
      //   //     dataZoom: {
      //   //       yAxisIndex: "none",
      //   //     },
      //   //     restore: {},
      //   //   },
      //   // },
      //   xAxis: {
      //     type: "time",
      //     axisPointer: {
      //       // value: "2016-10-7-9-0-0",
      //       snap: true,
      //       lineStyle: {
      //         color: "#7581BD",
      //         width: 2,
      //       },
      //       label: {
      //         show: true,
      //         formatter: function (params) {
      //           return echarts.format.formatTime(
      //             "yyyy-MM-dd hh:mm:ss",
      //             params.value
      //           );
      //         },
      //         backgroundColor: "#7581BD",
      //       },
      //       handle: {
      //         show: true,
      //         color: "#7581BD",
      //       },
      //     },
      //     splitLine: {
      //       show: false,
      //     },
      //   },
      //   yAxis: {
      //     type: "value",
      //     axisTick: {
      //       inside: true,
      //     },
      //     splitLine: {
      //       show: false,
      //     },
      //     axisLabel: {
      //       inside: true,
      //       formatter: "{value}\n",
      //     },
      //     z: 10,
      //   },
      //   grid: {
      //     top: 110,
      //     left: 15,
      //     right: 15,
      //     height: 160,
      //   },
      //   dataZoom: [
      //     {
      //       type: "inside",
      //       throttle: 50,
      //     },
      //   ],
      //   series: [
      //     {
      //       name: "Fake Data",
      //       type: "line",
      //       smooth: true,
      //       symbol: "circle",
      //       symbolSize: 5,
      //       sampling: "average",
      //       itemStyle: {
      //         color: "#0770FF",
      //       },
      //       stack: "a",
      //       areaStyle: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //           {
      //             offset: 0,
      //             color: "rgba(58,77,233,0.8)",
      //           },
      //           {
      //             offset: 1,
      //             color: "rgba(58,77,233,0.3)",
      //           },
      //         ]),
      //       },
      //       data: data,
      //     },
      //     // {
      //     //   name: "Fake Data",
      //     //   type: "line",
      //     //   smooth: true,
      //     //   stack: "a",
      //     //   symbol: "circle",
      //     //   symbolSize: 5,
      //     //   sampling: "average",
      //     //   itemStyle: {
      //     //     color: "#F2597F",
      //     //   },
      //     //   areaStyle: {
      //     //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //     //       {
      //     //         offset: 0,
      //     //         color: "rgba(213,72,120,0.8)",
      //     //       },
      //     //       {
      //     //         offset: 1,
      //     //         color: "rgba(213,72,120,0.3)",
      //     //       },
      //     //     ]),
      //     //   },
      //     //   data: data2,
      //     // },
      //   ],
      // };
      // console.log(data);
      option && myChart.setOption(option);
    },
    singleclick() {
      // 点击
      this.openmap.on("singleclick", (e) => {
        // 判断是否点击在点上
        let feature = this.openmap.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature
        );
        // console.log(feature.get("name"));
        if (feature) {
          // console.log(111);
          this.feature_click = feature;
          this.FID = feature.get("FID");
          console.log(feature.get("FID"));
          this.initchart();
        }
      });
    },
    btngoback() {
      if (this.dateNum > 0) {
        this.dateNum = this.dateNum - 1;
        this.beforeAddTsImg();
      } else {
        ElMessage({
          message: "已经是第一张",
          type: "warning",
        });
      }
    },
    btngoplay() {
      if (this.btnIsPlay) {
        //正在播放
        this.btnIsPlay = false;
        clearInterval(this.picPlayer);
      } else {
        //未播放
        this.btnIsPlay = true;
        let that = this;
        this.picPlayer = setInterval(() => {
          that.btngoforward();
        }, 1500);
      }
    },
    btngoforward() {
      if (this.dateNum < 145) {
        this.dateNum = this.dateNum + 1;
        this.beforeAddTsImg();
      } else {
        ElMessage({
          message: "已经是最后一张",
          type: "warning",
        });
        if (this.btnIsPlay) {
          this.btnIsPlay = false;
          clearInterval(this.picPlayer);
        }
      }
    },
    beforeAddTsImg() {
      this.openmap.removeLayer(this.pnglayer);
      // this.openmap.removeSource(this.imgsource);
      this.addTsImg();
    },
    addTsImg() {
      // console.log(this.dataServer + "/ts_output/ts_4_0 copy.png");
      this.allLayers = this.openmap.getLayers();
      // this.dateNum = (this.dateNum + 1) % 144;
      this.imgurl = "/case/png/test_t_" + this.dateNum + "_cvt.png";
      this.openmap.removeLayer(this.pnglayer);
      // this.imgurl = "/png/test_t_0_cvt.png";
      this.imgsource = new ImageStatic({
        url: this.imgurl, //地址
        projection: "EPSG:4326",
        imageExtent: [119.182854, 27.166469, 123.360253, 35.375766],
      });
      this.pnglayer = new Image({
        source: this.imgsource,
      });
      // this.openmap.addLayer(this.pnglayer, 3);
      this.allLayers.insertAt(1, this.pnglayer);
      // map.addSource("rainImgSource", {
      //   type: "image",
      //   url: imgUrl,
      //   coordinates: [
      //     [114.8, 35.1],
      //     [122.8, 35.1],
      //     [122.8, 27.1],
      //     [114.8, 27.1],
      //   ],
      // });
      // map.addLayer(
      //   {
      //     id: "rainImgLayer",
      //     source: "rainImgSource",
      //     type: "raster",
      //     paint: { "raster-opacity": 0.85 },
      //   },
      //   "rainStationLayer"
      // );
    },
    sliderChangePic(value) {
      this.beforeAddTsImg();
    },
  },
  mounted() {
    this.initmap();
    // this.autoChange();
    let control = document.querySelector(".ol-control");
    control.style = "display:none";
    let rotate = document.querySelector(".ol-rotate");
    rotate.style = "display:none";
    this.btngoplay();
    // this.initchart();
  },
  computed: {
    converTime: function () {
      let startTimeString = "2021-8-17 11:00:00";
      let time = new Date(startTimeString);
      let newDate = time.setHours(time.getHours() + this.dateNum * 1);
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
    },
  },
};
</script>
  
  <style lang="less" scoped>
#map1 {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
}
.map-zoom-lnglat {
  position: absolute;
  bottom: 30px;
  right: 50px;
  z-index: 99;
  /*background-color: #fafafa !important;*/
  font-size: 13px;
}
#chart {
  width: 500px;
  height: 300px;
  z-index: 1000;

  // left: 50px;
  // padding: 5px;
}
.info-card {
  position: absolute;

  z-index: 1000;
  top: 200px;
  // width: 500px;
  // height: 700px;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  left: 50px;

  /* opacity: 0.8; */
  /* background-color: rgba(0, 0, 0, 0); */
}
.chart-card {
  // position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  // top: 100px;
  z-index: 1000;
  padding: 5px 0 0 0;

  /* bottom: 50px; */

  /* left: 50px; */
  // opacity: 0.8;
}

.play-card {
  margin-top: 8px;
  // bottom: 190px;
  // position: absolute;
  z-index: 1000;
  /* bottom: 50px; */
  width: 500px;
  height: fit-content;
  padding: 5px 20px 8px 20px;
  /* left: 50px; */
  // opacity: 0.8;
}
.demonstration {
  widows: 10vw;
}
/deep/.slider-demo-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.water_depth_color {
  width: 350px;
  height: 40px;
  padding: 5px 15px;
  z-index: 9;
  position: absolute;
  bottom: 20px;
  left: 70px;

  display: flex;
  align-items: center;
  background-color: rgba(124, 120, 120, 0.2);
  border-radius: 5px;
  /* box-shadow: 2px 2px 2px #aaa; */
  opacity: 0.9;
  color: #b9b8ce;
}

.water_depth_color .color-bar {
  display: flex;
  height: fit-content;
  flex-direction: column;
  /* background-color: red; */
}

.water_depth_color .color-bar .color {
  width: fit-content;
  height: fit-content;
  display: flex;
  padding-left: 10px;
}

.water_depth_color .color-bar .label {
  display: flex;
  height: fit-content;
  width: fit-content;
  font-size: 12px;
  // padding-right: 2px;
}

.water_depth_color .color-bar .color-item {
  width: 36px;
  height: 12px;
}
.el-card {
  --el-card-padding: 0px;
}
</style>