<template>
  <div>
    <div id="map" class="map-home"></div>
    <div class="selectbox">
      <div class="select">图层渲染方式:</div>
      <el-select
        v-model="value"
        class="m-2"
        placeholder="请选择渲染方式"
        size="large"
        @change="selectindexchange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div ref="popup" class="popup" v-show="showinfo">
      <div ref="city" style="font-size: 10px"></div>
      <div ref="info" style="font-size: 10px"></div>
    </div>
    <div class="legend">
      <div class="title">图例</div>
      <div class="lgd">
        <div class="yellow"></div>
        <div class="text">装机容量(GW)</div>
      </div>
      <div class="lgd">
        <div class="blue"></div>
        <div class="text">发电量(TWh)</div>
      </div>
      <div class="lgd" style="margin-bottom: 5px">
        <div class="red"></div>
        <div class="text">碳减排量(Million ton)</div>
      </div>
      <hr />
      <div class="map-legend-1" v-if="this.value == '1'">
        <div class="color-bar">
          <div class="c1"></div>
          <div class="c2"></div>
          <div class="c3"></div>
          <div class="c4"></div>
          <div class="c5"></div>
          <div class="c6"></div>
        </div>
        <div class="descrip">
          <div class="first">N/A</div>
          <div>0-10</div>
          <div>10-15</div>
          <div>15-20</div>
          <div>20-40</div>
          <div>40-80</div>
        </div>
      </div>
      <div class="map-legend-2" v-if="this.value == '2'">
        <div class="color-bar">
          <div class="c1"></div>
          <div class="c7"></div>
          <div class="c8"></div>
          <div class="c9"></div>
          <div class="c10"></div>
          <div class="c11"></div>
        </div>
        <div class="descrip">
          <div class="first">N/A</div>
          <div>0-10</div>
          <div>10-15</div>
          <div>15-25</div>
          <div>25-40</div>
          <div>40-70</div>
        </div>
      </div>
      <div class="map-legend-3" v-if="this.value == '3'">
        <div class="color-bar">
          <div class="c1"></div>
          <div class="c12"></div>
          <div class="c13"></div>
          <div class="c14"></div>
          <div class="c15"></div>
          <div class="c16"></div>
        </div>
        <div class="descrip">
          <div class="first">N/A</div>
          <div>0-5</div>
          <div>5-10</div>
          <div>10-20</div>
          <div>20-30</div>
          <div>30-60</div>
        </div>
      </div>
    </div>
    <!-- <div id="chart" ref="chart" style="display：none"></div> -->
  </div>
</template>
  
  <script>
import GeoJSON from "ol/format/GeoJSON";
// import * as olProj from "ol/proj";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj.js";
import VectorLayer from "ol/layer/VectorImage";
import VectorSource from "ol/source/Vector";
import { Map, View, Overlay, Feature } from "ol";
import * as proj from "ol/proj";
// import * as ol from "ol";
// import "@/assets/olext.js";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Text } from "ol/style";
import Chart from "ol-ext/style/Chart.js";
// import { Select } from "ol/interaction";
import ol_ordering from "ol-ext/render/Ordering";
import chats from "@/assets/charts_yangtze.json";
// import "@/assets/ol-ext.js";
export default {
  name: "openLys",
  data() {
    return {
      // backUrl_backup:backUrl_backup,
      openmap: null,
      showinfo: false,
      ovlay: null,
      vectorLayer: null,
      key: "3bb0fffc32732aaaddcf078379682d61",
      tilelayer: null,
      highlight_click: null,
      highlight_hover: null,
      feature_click: null,
      feature_hover: null,
      styleCache: {},
      animation: false,
      maxzoom: 0,
      minzoom: 0,
      radius: 12,
      value: "1",
      options: [
        {
          value: "1",
          label: "装机容量",
        },
        {
          value: "2",
          label: "发电量",
        },
        {
          value: "3",
          label: "碳减排量",
        },
      ],
    };
  },
  methods: {
    initmap() {
      this.vectorLayer = new VectorLayer({
        // background: "#1a2b39",
        source: new VectorSource({
          // features: new GeoJSON().readFeatures("china_sim.json"),
          url: "yangtze_delta.json",
          format: new GeoJSON(),
        }),
        style: this.setstyle,
      });
      this.tilelayer = new TileLayer({
        source: new XYZ({
          url:
            "http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" +
            this.key,
          //   attributions: attributions,
          crossOrigin: "anonymous",
          tileSize: 512,
        }),
      });
      let newlayer = new TileLayer({
        source: new XYZ({
          url:
            "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" +
            this.key,
          //   attributions: attributions,
          crossOrigin: "anonymous",
          tileSize: 512,
        }),
      });
      this.openmap = new Map({
        target: "map",
        layers: [this.tilelayer, newlayer, this.vectorLayer],
        // layers: [this.tilelayer],
        view: new View({
          center: fromLonLat([120.583905, 31.313832]),
          zoom: 7,
        }),
      });
      //   this.openmap = openmap;
      // this.openmap.events.register("zoomend", this, function () {
      //   //每次地图缩放时就会进入到这
      //   if (this.openmap.getZoom() > 0) {
      //     console.log(1111123123);
      //   }
      // });
      this.singleclick();
      this.addOverlay();
      this.pointermove();
      this.initbar();
      this.move();
    },
    hover(pixel) {
      // console.log(this.openmap);
      const feature = this.openmap.forEachFeatureAtPixel(
        pixel,
        function (feature) {
          return feature;
        }
      );
      // if (feature !== highlight) {
      if (this.highlight_hover) {
        this.feature_hover.getSource().removeFeature(this.highlight_hover);
      }
      if (feature) {
        this.feature_hover.getSource().addFeature(feature);
      }
      this.highlight_hover = feature;
    },
    click(pixel) {
      const feature = this.openmap.forEachFeatureAtPixel(
        pixel,
        function (feature) {
          return feature;
        }
      );
      // if (feature !== highlight) {
      if (this.highlight_click) {
        this.feature_click.getSource().removeFeature(this.highlight_click);
      }
      if (feature) {
        this.feature_click.getSource().addFeature(feature);
      }
      this.highlight_click = feature;
    },
    initselect() {
      //鼠标点击要素的样式
      this.feature_click = new VectorLayer({
        source: new VectorSource(),
        zIndex: 2,
        map: this.openmap,
        style: new Style({
          stroke: new Stroke({
            color: "rgba(107, 236, 245, 1)",
            width: 2,
          }),
        }),
      });
      //鼠标移入要素的样式
      this.feature_hover = new VectorLayer({
        source: new VectorSource(),
        zIndex: 2,
        map: this.openmap,
        style: new Style({
          fill: new Fill({
            color: "rgba(107, 236, 245, 1)",
          }),
        }),
      });
    },
    addOverlay() {
      // 创建Overlay
      let elPopup = this.$refs.popup;
      this.popup = new Overlay({
        element: elPopup,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -20],
      });
      this.openmap.addOverlay(this.popup);
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
          this.showinfo = true;
          // 设置弹窗位置
          //   console.log(feature.get("POINT_X_1"));
          //   console.log(feature.get("POINT_Y_1"));
          let coords = new Array();
          coords[0] = feature.get("POINT_X_1");
          coords[1] = feature.get("POINT_Y_1");
          console.log(coords[0]);
          let coordinates = proj.fromLonLat(coords);
          //   console.log(coordinates);
          this.popup.setPosition(coordinates);
          this.$refs.city.innerHTML = feature.get("市");
          this.$refs.info.innerHTML = `<p>装机容量(GW):${feature.get(
            "IC"
          )}</p><p>发电量(TWh):${feature.get(
            "PG"
          )}</p><p>碳减排量(Million ton):${feature.get("VC")}</p>`;
          const pixel = this.openmap.getEventPixel(e.originalEvent);
          this.click(pixel);
        } else {
          this.showinfo = false;
          // console.log("zzasd");
          if (this.highlight_click) {
            this.feature_click.getSource().removeFeature(this.highlight_click);
          }
        }
      });
    },
    pointermove() {
      this.openmap.on("pointermove", (e) => {
        if (e.dragging) {
          return;
        }
        if (this.openmap.hasFeatureAtPixel(e.pixel)) {
          this.openmap.getViewport().style.cursor = "pointer";
          const pixel = this.openmap.getEventPixel(e.originalEvent);
          this.hover(pixel);
        } else {
          this.openmap.getViewport().style.cursor = "inherit";
          this.feature_hover.getSource().removeFeature(this.highlight_hover);
        }
      });
    },
    setstyle(feature) {
      let InstalledC = feature.get("IC");
      let PG = feature.get("PG");
      let VC = feature.get("VC");
      if (this.value == "1") {
        if (InstalledC == 0) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(225,225,225,1)",
            }),
          });
        } else if (InstalledC > 0 && InstalledC <= 10) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(254,247,230,1)",
            }),
          });
        } else if (InstalledC > 10 && InstalledC <= 15) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(241,213,165,1)",
            }),
          });
        } else if (InstalledC > 15 && InstalledC <= 20) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(232,175,105,1)",
            }),
          });
        } else if (InstalledC > 20 && InstalledC <= 40) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(218,133,48,1)",
            }),
          });
        } else if (InstalledC > 40 && InstalledC <= 80) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(210,86,1,1)",
            }),
          });
        }
      } else if (this.value == "2") {
        if (PG == 0) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(225,225,225,1)",
            }),
          });
        } else if (PG > 0 && PG <= 10) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(234,247,243,1)",
            }),
          });
        } else if (PG > 10 && PG <= 15) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(176,209,206,1)",
            }),
          });
        } else if (PG > 15 && PG <= 25) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(120,171,168,1)",
            }),
          });
        } else if (PG > 25 && PG <= 40) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(71,133,135,1)",
            }),
          });
        } else if (PG > 40 && PG <= 70) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(17,105,106,1)",
            }),
          });
        }
      } else if (this.value == "3") {
        if (VC == 0) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(225,225,225,1)",
            }),
          });
        } else if (VC > 0 && VC <= 5) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(242,242,254,1)",
            }),
          });
        } else if (VC > 5 && VC <= 10) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(207,207,243,1)",
            }),
          });
        } else if (VC > 10 && VC <= 20) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(147,149,204,1)",
            }),
          });
        } else if (VC > 20 && VC <= 30) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(86,95,151,1)",
            }),
          });
        } else if (VC > 30 && VC <= 60) {
          return new Style({
            stroke: new Stroke({
              color: "rgba(153,153,153,1)",
              width: 1,
            }),
            fill: new Fill({
              color: "rgba(41,55,115,1)",
            }),
          });
        }
      }
    },
    initbar() {
      // var ext = this.openmap.getView().calculateExtent(this.openmap.getSize());
      // console.log(ext);
      var features = [];
      for (var i = 0; i < 41; i++) {
        let nb = 0;
        let data = [];
        data.push(chats[i].InstalledCapacity);
        data.push(chats[i].PowerGeneration);
        data.push(chats[i].VolumeofCarbonMitigation);
        nb =
          chats[i].InstalledCapacity +
          chats[i].PowerGeneration +
          chats[i].VolumeofCarbonMitigation;
        // console.log(chats[i].x);
        features[i] = new Feature({
          geometry: new Point(fromLonLat([chats[i].x, chats[i].y])),
          市: chats[i].name,
          POINT_X_1: chats[i].x,
          POINT_Y_1: chats[i].y,
          data: data,
          size: nb,
          IC: chats[i].InstalledCapacity,
          PG: chats[i].PowerGeneration,
          VC: chats[i].VolumeofCarbonMitigation,
        });
      }
      // console.log(features)
      let that = this;
      var vector = new VectorLayer({
        name: "Vecteur",
        zIndex: 3,
        source: new VectorSource({ features: features }),
        // y ordering
        renderOrder: ol_ordering.yOrdering(),
        style: function (f) {
          return that.getFeatureStyle(f);
        },
      });
      console.log(vector);

      this.openmap.addLayer(vector);
      // console.log(this.openmap.layers);
      // Control Select
      // var select = new Select({
      //   style: function (f) {
      //     return that.getFeatureStyle(f, true);
      //   },
      // });
      // this.openmap.addInteraction(select);

      //   select.getFeatures().on(["add", "remove"], function (e) {
      //     if (e.type == "add")
      //       $("#select").html(
      //         "Selection data: " + e.element.get("data").toString()
      //       );
      //     else $("#select").html("No selection");
      //   });
    },
    getFeatureStyle(feature, sel) {
      var k =
        "bar" + "-" + "classic" + "-" + (sel ? "1-" : "") + feature.get("data");
      var style = this.styleCache[k];
      let a = feature.get("data");
      if (!style) {
        // var radius = 15;
        // area proportional to data size: s=PI*r^2
        // if ($("#graph").val() != "bar") {
        //   radius = 8 * Math.sqrt(feature.get("size") / Math.PI);
        // }
        // Create chart style
        var c = "classic";
        this.styleCache[k] = style = [
          new Style({
            image: new Chart({
              type: "bar",
              radius: (this.radius * a[0]) / 9,
              // radius: 50,
              displacement: [0, (sel ? 1.2 : 1) * this.radius],
              // data: [10, 30, 20],
              data: feature.get("data"),
              colors: /,/.test(c) ? c.split(",") : c,
              rotateWithView: true,
              animation: this.animation,
              stroke: new Stroke({
                color: "#fff",
                width: 2,
              }),
            }),
            text: new Text({
              textAlign: "center",
              textBaseline: "middle",
              font: "bold 12px 微软雅黑",
              text: feature.get("市"),
              offsetY: 15,
              offsetX: -15,
              fill: new Fill({
                color: "black",
              }),
            }),
          }),
        ];
      }
      //   style[0].getImage().setAnimation(this.animation);
      return style;
    },
    move() {
      this.openmap.on("moveend", () => {
        let zoom = this.openmap.getView().getZoom(); //获取当前地图的缩放级别
        // console.log(zoom);
        this.radius = this.radius / zoom;
        // let newsty = new Style();
        // this.openmap
        //   .getLayerGroup()
        //   .getLayers()
        //   .array_[2].setStyle(function (f) {
        //     return this.getFeatureStyle(f);
        //   });
        // do something
      });
    },
    selectindexchange() {
      console.log(this.value);
      this.vectorLayer.setStyle(this.setstyle);
    },
  },
  mounted() {
    // this.chart = this.$refs.chart;
    this.initmap();
    this.initselect();
    // this.maxzoom = this.openmap.getzoom();
    console.log(this.openmap.getView());
    // console.log(chats);
    this.maxzoom = this.openmap.getView().zoomFactor_;
    console.log(this.maxzoom);
    let control = document.querySelector(".ol-control");
    control.style = "display:none";
    let rotate = document.querySelector(".ol-rotate");
    rotate.style = "display:none";
  },
};
</script>
  
  <style lang="less" scoped>
.map-home {
  width: 100%;
  height: 900px;
}
.popup {
  width: 200px;
  background-color: white;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgb(177, 177, 177);
}
/deep/.info {
  font-size: 10px;
  /* text-align: left; */
}
/deep/.city {
  font-size: 10px;
}
/deep/.legend {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 300px;
  height: 200px;
  background-color: rgba(255, 255, 255);
  box-shadow: 0 0 15px rgb(177, 177, 177);
  border-radius: 5px;
}
/deep/.lgd {
  line-height: 20px;
  margin-top: 10px;
  margin-left: 5px;
  display: flex;
}
/deep/.text {
  // display: flex;
  height: 20px;
  font-weight: 400;
}
/deep/.blue {
  width: 20px;
  height: 20px;
  background-color: #271dfa;
  // display: flex;
  border-radius: 2px;
  border: #fff 1px;
  margin-right: 5px;
  margin-left: 20px;
}
/deep/.red {
  width: 20px;
  height: 20px;
  background-color: #ff0019;
  // display: flex;
  border-radius: 2px;
  margin-right: 5px;
  margin-left: 20px;
}
/deep/.yellow {
  width: 20px;
  height: 20px;
  background-color: #ffa52a;
  // display: flex;
  border-radius: 2px;
  margin-right: 5px;
  margin-left: 20px;
}
/deep/.title {
  width: 20%;
  margin: auto;
  font-weight: 800;
  font-size: 18px;
}
/deep/.map-legend-1 {
  width: 100%;
  height: 50px;
}
/deep/.color-bar {
  display: flex;
  margin-top: 5px;
  margin-left: 25px;
}
/deep/.c1 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(225, 225, 225, 1);
}
/deep/.c2 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(254, 247, 230, 1);
}
/deep/.c3 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(241, 213, 165, 1);
}
/deep/.c4 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(232, 175, 105, 1);
}
/deep/.c5 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(218, 133, 48, 1);
}
/deep/.c6 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(210, 86, 1, 1);
}
/deep/.c7 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(234, 247, 243, 1);
}
/deep/.c8 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(176, 209, 206, 1);
}
/deep/.c9 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(121, 171, 167, 1);
}
/deep/.c10 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(69, 134, 133, 1);
}
/deep/.c11 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(17, 105, 106, 1);
}
/deep/.c12 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(242, 242, 254, 1);
}
/deep/.c13 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(207, 207, 242, 1);
}
/deep/.c14 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(147, 150, 204, 1);
}
/deep/.c15 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(86, 95, 152, 1);
}
/deep/.c16 {
  border-top: 1px black solid;
  border-bottom: 1px black solid;
  height: 20px;
  width: 43px;
  background-color: rgba(42, 55, 115, 1);
}
/deep/.descrip {
  display: flex;
  margin-left: 18px;
  // writing-mode: vertical-lr;
}
/deep/.descrip div {
  margin-left: 11px;
}
/deep/.first {
  margin-right: 5px;
}
/deep/.selectbox {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
}
/deep/.select {
  // background-color: #fff;
  font-size: 18px;
  padding-top: 7px;
  font-weight: 600;
  // border-radius: 5px;
  // border: 1px solid #fff;
  // text-align: center;
  // line-height: inherit;
}
</style>