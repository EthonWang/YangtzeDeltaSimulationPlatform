<template>
  <div id="temp">
    <div
      style="display: -webkit-flex; display: flex; width: 100%; height: 100%"
    >
      <div style="width: 90%; height: 100%">
        <div id="cesiumContainer"></div>
      </div>
      <div
        style="
          width: 10%;
          height: 100%;
          background-color: #d3d3d3;
          padding: 30px;
        "
      >
        <button class="btn" @click="addWaterAnimate">添加水面动画</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import axios from "axios";
import proj4 from "proj4";
export default {
  name: "StormSurge2",
  props: ["tifList", "jsonList"],
  data() {
    return {
      viewer: null,
      model: null, //切片模型
      marks: [],
      marksIndex: 1,
      pitchValue: -10,
      remainTime: 0,
      usedTime: 0,
    };
  },
  mounted() {
    this.cesiumInit();
  },
  beforeUnmount() {
    this.destroyMap();
  },
  methods: {
    cesiumInit() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2RjODQxYy0xNDI0LTRmNmYtOTJjNy02Njk3NGFmNGZlMzMiLCJpZCI6ODg1MTgsImlhdCI6MTY0OTI1MzIzNn0._0nz9pC6RF2dXjkzTilweCdZOP6jE-9Efc1QqjMOR_Q";
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: Cesium.createWorldTerrain(),
        //   geocoder: false,
        //   homeButton: false,
        // sceneModePicker: false,
        // infobox: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        // globe: false,
      });
      //开启深度检测
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      // 提示错误Blocked script execution in ‘about:blank’ because the document’s frame is sandboxed and the ‘allow-scripts’ permission is not set.的解决方法
      let iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
      iframe.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-popups allow-forms"
      );
      iframe.setAttribute("src", ""); //必须设置src为空 否则不会生效
      this.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
      this.viewer.scene.debugShowFramesPerSecond = true; //显示帧数
      // 隐藏toolbar显示
      // document.getElementsByClassName("cesium-viewer-toolbar")[0].style.display = "none";
      // document.getElementsByClassName("cesium-viewer-animationContainer")[0].style.display = "none";
      // document.getElementsByClassName("cesium-viewer-timelineContainer")[0].style.display = "none";
      // 不显示星空且背景透明
      this.viewer.scene.skyBox.show = true;
      this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.5);
      // 视角大小
      Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
      // 设置home在中国(左下角，右上角)
      const ChinaRectangle = Cesium.Rectangle.fromDegrees(
        119.080032,
        30.959241,
        122.789387,
        32.389027
      );
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = ChinaRectangle;
      this.viewer.camera.flyHome(4);
      // this.viewer.camera.setView({
      //   destination: {
      //     x: -3837625.3684990564,
      //     y: 8352013.776715521,
      //     z: 848647.0029156925,
      //   },
      //   orientation: {
      //     heading: 0.0776844705782338,
      //     pitch: -0.8335422539103585,
      //     roll: 6.282948442939382,
      //   },
      // });
      // this.addWaterAnimate()
    },
    destroyMap() {
      this.viewer.destroy();
      this.viewer = null;
    },
    addDem() {
      let that = this;
      let terrainProvider = new Cesium.CesiumTerrainProvider({
        url: "../res/data/dem/ASTGTM_N29E087D",
      });
      that.viewer.terrainProvider = terrainProvider;

      // that.viewer.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(87.54791, 29.57025, 17863.0),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(0.0),
      //     pitch: Cesium.Math.toRadians(-25.0),
      //     roll: 0.0,
      //   },
      // });
    },
    /**
     * 添加水面动画
     */
    addWaterAnimate() {
      let that = this;
      let globe = this.viewer.scene.globe;
      globe.depthTestAgainstTerrain = true;
      this.viewer.camera.setView({
        //定位到范围中心点
        destination: Cesium.Cartesian3.fromDegrees(
          87.07131373100303,
          29.40857655725876,
          12000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(130.304929908965146), //1
          pitch: Cesium.Math.toRadians(-17.364771143804237),
          roll: 0.09931507517437696,
        },
      });
      // 119.080032,30.959241,122.789387,32.389027
      // let points = [
      //   [119.080032, 30.959241],
      //   [122.789387, 30.959241],
      //   [119.080032, 32.389027],
      //   [122.789387, 32.389027],
      // ];
      let points = [
        [87.07131373100303, 29.40857655725876],
        [87.33503858397042, 29.41843499494008],
        [87.33072496578943, 29.193059292424955],
        [87.05098771260403, 29.20286249623694],
      ];
      let polygonArr = [];
      for (let i = 0; i < points.length; i++) {
        polygonArr.push(points[i][0]);
        polygonArr.push(points[i][1]);
        polygonArr.push(0);
      }
      that.drawWater(4500, polygonArr, 4000);
    },
    /**
     *
     * @param {*} targetHeight 目标高度
     * @param {*} areaCoor  范围坐标
     * @param {*} waterHeight 当前水高度
     */
    drawWater(targetHeight, areaCoor, waterHeight) {
      let that = this;
      that.viewer.entities.remove(that.waterEntity);
      that.waterEntity = that.viewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(areaCoor),
          perPositionHeight: true,
          extrudedHeight: new Cesium.CallbackProperty(function () {
            //此处用属性回调函数，直接设置extrudedHeight会导致闪烁。
            waterHeight += 2;
            if (waterHeight > targetHeight) {
              waterHeight = targetHeight; //给个最大值
            }
            return waterHeight;
          }, false),
          material: new Cesium.Color.fromBytes(0, 191, 255, 100),
        },
      });
    },
  },
};
</script>

<style>
</style>