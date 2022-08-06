<template>
  <!-- <button @click="turn2home()">huidaozhuye</button> -->
  <div class="mapbox-page">
    <div id="map" ref="map"></div>
    <div id="info"></div>
  </div>
  <el-card shadow="always" class="info-title">
    <h1>长三角区域风暴潮模拟</h1>  
  </el-card>
  <el-card shadow="always" class="info-card">
  </el-card>
</template>

<script>
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
    };
  },
  mounted() {
    this.initMap();
  },
  methods:{
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
  }
};
</script>

<style>
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
  width: 15%;
  height: 45vh;
  opacity: 0.8;
}
</style>