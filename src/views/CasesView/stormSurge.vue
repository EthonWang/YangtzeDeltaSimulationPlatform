<template>
  <!-- <button @click="turn2home()">huidaozhuye</button> -->
  <div class="mapbox-page">
    <div id="map" ref="map"></div>
    <div id="info"></div>
  </div>
  <el-card shadow="always" class="info-title">
    <h1>长三角区域气候模拟</h1>
  </el-card>
  <el-card shadow="always" class="info-card">
    <el-scrollbar max-height="20vh">
      <el-tabs
        type="border-card"
        class="info-tabs"
        v-model="paneType"
        @tab-change="tabChangeHandle"
      >
        <el-tab-pane label="气温" name="ts">
          <div class="slider-demo-block">
            <span class="demonstration"><strong>时间轴</strong></span>
            <span class="demonstration" style="float: right"
              >当前时间：{{ converTime }}</span
            >
            <el-slider
              v-model="dateNum"
              :max="1459"
              @change="sliderChangePic"
              style="width: 90%"
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
        <el-tab-pane label="降水" name="pr">
          <div class="slider-demo-block">
            <span class="demonstration"><strong>时间轴</strong></span>
            <span class="demonstration" style="float: right"
              >当前时间：{{ converTime }}</span
            >
            <el-slider
              v-model="dateNum"
              :max="1459"
              @change="sliderChangePic"
              style="width: 90%"
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
  <div class="colorbar" v-if="paneType == 'ts'">
    <el-image :src="colorbarUrl" :fit="cover"/>
  </div>
  <div class="colorbar-pr" v-if="paneType == 'pr'">
    <el-image :src="colorbarUrl" :fit="cover"/>
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
      colorbarUrl: "",
      paneType: "ts",
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
      if (this.paneType == "ts") {
        if (this.dateNum > 0) {
          this.dateNum = this.dateNum - 1;
          this.beforeAddTsImg();
        } else {
          ElMessage({
            message: "已经是第一张",
            type: "warning",
          });
        }
      } else if (this.paneType == "pr") {
        if (this.dateNum > 0) {
          this.dateNum = this.dateNum - 1;
          this.beforeAddTsImg();
        } else {
          ElMessage({
            message: "已经是第一张",
            type: "warning",
          });
        }
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
      if (this.paneType == "ts") {
        if (this.dateNum < 1459) {
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
      } else if (this.paneType == "pr") {
        if (this.dateNum < 1459) {
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
      }
    },
    beforeAddTsImg() {
      map.removeLayer("tsimg_01_layer");
      map.removeSource("tsimg_01");
      this.addTsImg();
    },
    addTsImg() {
      // console.log(this.dataServer + "/ts_output/ts_4_0 copy.png");
      if (this.paneType == "ts") {
        this.colorbarUrl = this.dataServer + "/store/ts_output/ts_colorbar.png";
        map.addSource("tsimg_01", {
          type: "image",
          url:
            this.dataServer +
            "/store/ts_output/ts_4_" +
            this.dateNum +
            " 拷贝.png", //图像地址
          coordinates: [
            //图像显示4个点的位置信息114.87846289, 122.84646289,27.1434226850001, 35.1114226850001
            [114.87846289, 35.1114226850001], //左上
            [122.84646289, 35.1114226850001], //右上
            [122.84646289, 27.1434226850001], //右下
            [114.87846289, 27.1434226850001], //左下
          ],
        });
        let newLayer = {
          id: "tsimg_01_layer",
          source: "tsimg_01",
          type: "raster",
          // paint: this.layerStyle["fill"].paint,
          // "source-layer": newShpInfo.visualDataItems[index].name.split(".shp")[0],
        };
        // console.log(newLayer);
        map.addLayer(newLayer);
      } else if (this.paneType == "pr") {
        this.colorbarUrl = this.dataServer + "/store/ts_output/pr_colorbar.png";
        map.addSource("tsimg_01", {
          type: "image",
          url:
            this.dataServer +
            "/store/ts_output/pr_4_" +
            this.dateNum +
            " 拷贝.png", //图像地址
          coordinates: [
            //图像显示4个点的位置信息114.87846289, 122.84646289,27.1434226850001, 35.1114226850001
            [114.87846289, 35.1114226850001], //左上
            [122.84646289, 35.1114226850001], //右上
            [122.84646289, 27.1434226850001], //右下
            [114.87846289, 27.1434226850001], //左下
          ],
        });
        let newLayer = {
          id: "tsimg_01_layer",
          source: "tsimg_01",
          type: "raster",
          // paint: this.layerStyle["fill"].paint,
          // "source-layer": newShpInfo.visualDataItems[index].name.split(".shp")[0],
        };
        // console.log(newLayer);
        map.addLayer(newLayer);
      }
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
      let startTimeString = "2017-1-1 6:00:00";
      let time = new Date(startTimeString);
      let newDate = time.setHours(time.getHours() + this.dateNum * 6);
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
.demonstration{
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
  bottom: 55px;
  width: 60px;
  height: 260px;
}
.colorbar-pr {
  position: absolute;
  right: 55px;
  bottom: 42px;
  width: 70px;
  height: 260px;
}
/deep/ .slider-demo-block{
  display: none;
}
</style>