<template>
  <div class="mapbox-page">
    <div id="map"></div>
  </div>
  <el-card shadow="always" class="info-card">
    <el-scrollbar max-height="40vh">
      <el-descriptions :column="1" border style="width: 100%; height: 100%">
        <el-descriptions-item
          label="名称"
          label-align="center"
          align="center"
          label-class-name="my-label"
          class-name="my-content"
          min-width="65px"
          >{{ jsonData.name }}</el-descriptions-item
        >
        <el-descriptions-item label="类型" label-align="center" align="center"
          ><el-tag v-if="jsonData.type == 'data'" size="small">数据</el-tag
          ><el-tag v-else size="small">模型</el-tag></el-descriptions-item
        >
        <el-descriptions-item
          label="作者"
          label-align="center"
          align="center"
          >{{ jsonData.userEmail }}</el-descriptions-item
        >
        <el-descriptions-item label="标签" label-align="center" align="center">
          <el-tag
            size="small"
            v-for="(item, index) in tagList"
            :key="index"
            style="max-width: 150px; overflow: hidden"
            :title="tagList[index]"
            >{{ tagList[index] }}</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item
          label="数据量"
          label-align="center"
          align="center"
          >{{ jsonData.fileSize }}</el-descriptions-item
        >
        <el-descriptions-item
          label="时间"
          label-align="center"
          align="center"
          >{{ jsonData.createTime }}</el-descriptions-item
        >
        <el-descriptions-item
          label="描述"
          label-align="center"
          align="center"
          >{{ jsonData.description }}</el-descriptions-item
        >
        <el-descriptions-item
          label="数据列表"
          label-align="center"
          align="center"
        >
          <el-link
            v-for="(item, index) in jsonData.visualDataItems"
            :key="index"
            @click="showVisualDataItems(index)"
            style="color: black; margin-left: 5px;"
            >{{ item.name }}</el-link
          >
        </el-descriptions-item>
      </el-descriptions>
    </el-scrollbar>
  </el-card>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { useStore } from "vuex";

import { ElMessage } from "element-plus";
import { ElNotification } from "element-plus";

import "mapbox-gl/dist/mapbox-gl.css";
import { toRaw } from "@vue/reactivity";
var map = null;
export default {
  name: "MapboxCard",
  props: ["jsonData"],
  data() {
    return {
      showCenter: "-90,17",
      zoom: 6,
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
    };
  },
  watch: {
    jsonData(value) {
      // console.log(value);
      if (
        this.newShpInfo != value &&
        this.newShpInfo.visualWebAddress != "" &&
        this.newShpInfo.visualizationBoolean
      ) {
        map.removeLayer(this.newShpInfo.id);
        map.removeSource(this.newShpInfo.name + "_" + this.newShpInfo.id);
      }
      this.newShpInfo = value;
      this.addLayerToMap(value, 0);
      console.log(map);
      map.flyTo({
        center: [119.5, 31.5],
        zoom: 6,
      });
    },
  },
  mounted() {
    let that = this;
    setTimeout(function () {
      that.initMap();
    }, 500);
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

      this.newShpInfo = this.jsonData;
      //   console.log(this.newShpInfo);

      let that = this;
      setTimeout(function () {
        that.addLayerToMap(that.newShpInfo, 0);
      }, 1500);
    },
    addLayerToMap(data, index) {
      this.tagList = [];
      let normalTags = this.newShpInfo.normalTags.split(",");
      let problemTags = this.newShpInfo.problemTags.split(",");
      for (let i = 0; i < normalTags.length; i++) {
        this.tagList.push(normalTags[i]);
      }
      for (let i = 0; i < problemTags.length; i++) {
        this.tagList.push(problemTags[i]);
      }
      // 加载数据
      console.log(data);
      let newShpInfo = data;
      if (
        newShpInfo.visualWebAddress != "" &&
        newShpInfo.visualizationBoolean &&
        newShpInfo.visualType == "shp"
      ) {
        map.addSource(newShpInfo.name + "_" + newShpInfo.id, {
          type: "raster",
          tiles: [newShpInfo.visualDataItems[index].visualWebAddress],
        });
        let newLayer = {
          id: newShpInfo.id,
          source: newShpInfo.name + "_" + newShpInfo.id,
          type: "raster",
          // paint: this.layerStyle["fill"].paint,
          // "source-layer": newShpInfo.visualDataItems[index].name.split(".shp")[0],
        };
        console.log(newLayer);
        map.addLayer(newLayer);
      } else if (
        newShpInfo.visualWebAddress != "" &&
        newShpInfo.visualizationBoolean &&
        newShpInfo.visualType == "tif"
      ) {
        map.addSource(newShpInfo.name + "_" + newShpInfo.id, {
          type: "raster",
          tiles: [newShpInfo.visualDataItems[index].visualWebAddress],
          tileSize: 256, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
        });
        let newLayer = {
          id: newShpInfo.id,
          source: newShpInfo.name + "_" + newShpInfo.id,
          type: "raster",
        };
        map.addLayer(newLayer);
      } else if (!newShpInfo.visualizationBoolean) {
        ElNotification({
          title: newShpInfo.name,
          message: "该资源未开放可视化权限，详情请联系网站管理员！",
          type: "warning",
          duration: 5000,
        });
      } else if (newShpInfo.visualWebAddress == "") {
        ElNotification({
          title: newShpInfo.name,
          message: "未找到可视化资源文件！",
          type: "warning",
          duration: 5000,
        });
      }
    },
    showVisualDataItems(index) {
      map.removeLayer(this.newShpInfo.id);
      map.removeSource(this.newShpInfo.name + "_" + this.newShpInfo.id);
      let value = this.newShpInfo;
      this.addLayerToMap(value, index);
    },
  },
};
</script>

<style scoped lang="less">
.mapbox-page {
  /* position: absolute; */
  width: 100%;
  height: 50vh;
  /* top: 0px; */
  /* bottom: 0px; */
}
#map {
  /* position: absolute; */
  /* top: 0; */
  /* bottom: 0; */
  width: 100%;
  height: 100%;
}
/deep/.el-card{
  background: hsl(0,0,98%);
}
.info-card {
  position: absolute;
  left: 20px;
  top: 75px;
  width: 27%;
  height: 45vh;
  background: hsl(0,0,98%) !important;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>