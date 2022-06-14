<template>
  <div class="mapbox-page">
    <div id="map"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

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
            "fill-color": "#" + Math.random().toString(16).substr(2, 6),
          },
        },
      },
      newShpInfo: {},
    };
  },
  watch: {
    jsonData(value) {
    //   console.log(value);
      if (this.newShpInfo != value) {
        map.removeLayer(this.newShpInfo.id);
        map.removeSource(this.newShpInfo.name + "_" + this.newShpInfo.id);
      }
      this.newShpInfo = value;
      this.addLayerToMap(value);
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
        center: [120, 32],
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
      var nav = new mapboxgl.NavigationControl();
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
      setTimeout(function(){
        that.addLayerToMap(that.newShpInfo);
      },1000)
      
    },
    addLayerToMap(data) {
      // 加载数据
      let newShpInfo = data;
      map.addSource(newShpInfo.name + "_" + newShpInfo.id, {
        type: "geojson",
        data:
          "http://172.21.213.44:8087/static/resRepository/素材库/" +
          newShpInfo.path,
      });
      let newLayer = {
        id: newShpInfo.id,
        source: newShpInfo.name + "_" + newShpInfo.id,
        type: newShpInfo.geoType,
        paint: this.layerStyle[newShpInfo.geoType].paint,
      };
      map.addLayer(newLayer);
    },
  },
};
</script>

<style scoped>
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
</style>