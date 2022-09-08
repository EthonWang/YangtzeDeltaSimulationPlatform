<template>
  <!-- <button @click="turn2home()">huidaozhuye</button> -->
  <div class="mapbox-page">
    <div id="map" ref="map"></div>
    <div id="info"></div>
  </div>
  <el-card shadow="always" class="info-title">
    <h1>长三角土地利用演变多情景模拟</h1>
  </el-card>
  <el-card shadow="always" class="info-card">
    <el-scrollbar max-height="20vh">
      <el-tabs
        type="border-card"
        class="info-tabs"
        v-model="paneType"
        @tab-change="tabChangeHandle"
      >
        <el-tab-pane label="基准情景" name="basic">
          <div class="slider-demo-block">
            <span class="demonstration"><strong>时间轴</strong></span>
            <span class="demonstration" style="float: right"
              >当前时间：{{ converTime }}</span
            >
            <el-slider
              v-model="dateNum"
              :max="1459"
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
        </el-tab-pane>
        <el-tab-pane label="经济发展情景" name="economy">
          <div class="slider-demo-block">
            <span class="demonstration"><strong>时间轴</strong></span>
            <span class="demonstration" style="float: right"
              >当前时间：{{ converTime }}</span
            >
            <el-slider
              v-model="dateNum"
              :max="1459"
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
        </el-tab-pane>
        <el-tab-pane label="环境友好情景" name="environment">
          <div class="slider-demo-block">
            <span class="demonstration"><strong>时间轴</strong></span>
            <span class="demonstration" style="float: right"
              >当前时间：{{ converTime }}</span
            >
            <el-slider
              v-model="dateNum"
              :max="1459"
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
        </el-tab-pane>
        <el-tab-pane label="社会进步情景" name="society">
          <div class="slider-demo-block">
            <span class="demonstration"><strong>时间轴</strong></span>
            <span class="demonstration" style="float: right"
              >当前时间：{{ converTime }}</span
            >
            <el-slider
              v-model="dateNum"
              :max="1459"
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
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
  </el-card>
  <div class="colorbar">
    <el-image :src="colorbarUrl" :fit="cover" />
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
var map = null;
export default {
  name: "stormSurge",
  data() {
    return {
      showCenter: "-90,17",
      zoom: 7,
      layerStyle: {
        line: {
          layout: {
            visibility: "visible",
            // "line-sort-key":999
          },
          paint: {
            "line-color": "#" + Math.random().toString(16).substr(2, 6),
          },
        },
        circle: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "circle-sort-key":999,
          },
          paint: {
            "circle-color": "#" + Math.random().toString(16).substr(2, 6),
          },
        },
        fill: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "fill-sort-key":999
          },
          paint: {
            "fill-antialias": true,
            "fill-color": "#" + Math.random().toString(16).substr(2, 6),
            "fill-outline-color": "#000000",
          },
        },
      },
      newShpInfo: {},
      tagList: [],
      dataServer: useStore().getters.devIpAddress,
      colorbarUrl: "/YangtzeVGLabBack/store/data/landusesimulation.png",
      paneType: "basic",
      dateNum: 0,
      btnIsPlay: false,
      picPlayer: null,
    };
  },
  mounted() {
    this.initMap();
    let that = this;
    // this.addTsImg();
    setTimeout(() => {
      that.addTsImg();
    }, 1000);
  },
  watch: {
    btnIsPlay(val) {
      // console.log(val);
      // while (val) {
      //   let that = this;
      //   setTimeout(()=>{
      //     that.dateNum = that.dateNum + 1;
      //     that.btngoforward();
      //   }, 1000)
      // }
    },
  },
  methods: {
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
      // // //中文设置
      // mapboxgl.setRTLTextPlugin(
      //     "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js"
      // );
      // map.addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }));

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [119.5, 31.5],
        zoom: 6,
      });
      // map.addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }));

      var scale = new mapboxgl.ScaleControl({
        maxWidth: 120,
        unit: "imperial",
      });
      map.addControl(scale, "bottom-right");
      scale.setUnit("metric");

      // 添加控件缩放按钮和一个指南针.
      var nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
      });
      map.addControl(nav, "bottom-right");
      // 全局缩放
      map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

      //添加定位控件
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "bottom-right"
      );

      //zoom
      map.on("zoom", () => {
        this.zoom = map.getZoom().toFixed(2);
      });

      //center
      map.on("mousemove", (e) => {
        // this.center =
        //     String(e.lngLat.lng.toFixed(8)) +
        //     "," +
        //     String(e.lngLat.lat.toFixed(8));
        this.center = String(e.lngLat.lng) + "," + String(e.lngLat.lat);
        this.showCenter =
          String(e.lngLat.lng.toFixed(5)) +
          "," +
          String(e.lngLat.lat.toFixed(5));
      });
    },
    sliderChangePic(value) {
      this.beforeAddTsImg();
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
      if (this.dateNum < 9) {
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
      map.removeLayer("tsimg_01_layer");
      map.removeSource("tsimg_01");
      this.addTsImg();
    },
    addTsImg() {
      // console.log(this.dataServer + "/ts_output/ts_4_0 copy.png");
      let name = "basic2021";
      let time = 2021 + this.dateNum;
      if (this.paneType == "basic") {
        name = "basic" + time;
      } else if (this.paneType == "economy") {
        name = "economy" + time;
      } else if (this.paneType == "environment") {
        name = "environment" + time;
      } else if (this.paneType == "society") {
        name = "society" + time;
      }
      let pathUrl =
        "/YangtzeVGLabGeoServer/yangtzeRiver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=yangtzeRiver%3A" +
        name +
        "&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857&WIDTH=512&HEIGHT=512&BBOX={bbox-epsg-3857}";

      map.addSource("tsimg_01", {
        type: "raster",
        tiles: [pathUrl],
        tileSize: 256, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
      });
      let newLayer = {
        id: "tsimg_01_layer",
        source: "tsimg_01",
        type: "raster",
      };
      map.addLayer(newLayer);
    },
    tabChangeHandle(value) {
      this.paneType = value;
      this.beforeAddTsImg();
      if (this.btnIsPlay) {
        this.btnIsPlay = false;
        clearInterval(this.picPlayer);
      }
    },
  },
  computed: {
    converTime: function () {
      return 2021 + this.dateNum;
    },
  },
};
</script>

<style lang="less" scoped>
.mapbox-page {
  /* position: absolute; */
  width: 100%;
  height: 93vh;
}
#map {
  width: 100%;
  height: 100%;
}
.info-title {
  position: absolute;
  left: 20px;
  top: 20px;
  opacity: 0.8;
}
.info-card {
  position: absolute;
  left: 20px;
  bottom: 25px;
  width: 25%;
  height: 23vh;
  opacity: 0.9;
}
.demonstration {
  widows: 10vw;
}
.info-button-box {
  width: 100%;
}
.info-buttonGroup {
  // width: 70%;
  margin-top: 10px;
}
.colorbar {
  position: absolute;
  right: 55px;
  bottom: -225px;
  width: 120px;
  height: 450px;
}
/deep/ .slider-demo-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>