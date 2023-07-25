<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
  </div>
  <el-card shadow="always" class="info-title">
    <h1>太湖FVCOM模型模拟</h1>
  </el-card>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import axios from "axios";
import proj4 from "proj4";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";
export default {
  name: "TaiHu_FvCom",
  data() {
    return {
      viewer: null,
      model: null, //切片模型
      marks: [],
      marksIndex: 1,
      pitchValue: -10,
      remainTime: 0,
      usedTime: 0,
      projection: "+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs ",
      fromProjection:
        "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
      newProjection: `+proj=longlat +datum=WGS84 +no_defs`,
      stopJsonShow: true,
      dataServer: useStore().state.devIpAddress,
    };
  },
  mounted() {
    this.cesiumInit();
    let that = this;
    setTimeout(() => {
      that.getJsonList();
    }, 1500);
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
      //   this.viewer.camera.flyHome(4);
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
    getJsonList() {
      let fileNameList = ["speed_start.json", "speed_end.json"];
      let tempDataList = [];
      for (let i = 0; i < fileNameList.length; i++) {
        let path = "/store/taihu_fvcom/" + fileNameList[i];
        axios.get(this.dataServer + path).then((res) => {
          tempDataList[i] = res.data;
        });
        if (i == 1) {
          let that = this;
          ElNotification({
            title: "warning",
            message: "正在加载计算资源，请稍后！",
            type: "warning",
            duration: 5000,
          });
          setTimeout(function () {
            that.addJsonList(tempDataList);
          }, 5000);
        }
      }
    },
    addJsonList(tempDataList) {
      // console.log(tempDataList);
      let starts = tempDataList[0];
      let ends = tempDataList[1];
      let all_time_positions = [];
      for (let j = 0; j < ends.length; j++) {
        //72个时刻
        var one_time_positions = new Array();
        for (let i = 0; i < starts.length; i++) {
          let one_time_end = ends[j];

          // 投影坐标
          // debugger;
          var p1 = proj4(this.projection, this.newProjection, [
            starts[i][0],
            starts[i][1] + 3432500,
          ]);
          var p2 = proj4(this.projection, this.newProjection, [
            one_time_end[i][0],
            one_time_end[i][1] + 3432500,
          ]);
          one_time_positions.push([
            p1[0] + 8.15,
            p1[1],
            100,
            p2[0] + 8.15,
            p2[1],
            100,
          ]);

          // 经纬度
          // let ps = [
          //   starts[i][0],
          //   starts[i][1],
          //   one_time_end[i][0],
          //   one_time_end[i][1],
          // ];
          // one_time_positions.push(ps);
        }
        all_time_positions.push(one_time_positions);
      }

      // 显示第一帧
      for (let k = 0; k < starts.length; k++) {
        let ps = all_time_positions[0][k];
        this.viewer.entities.add({
          name: "speed",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(ps),
            width: 5,
            followSurface: true,
            material: new Cesium.PolylineArrowMaterialProperty(
              Cesium.Color.RED
            ),
          },
        });
      }
      // 移动相机位置-太湖
      this.viewer.camera.setView({
        destination: {
          x: -2843768.98286548,
          y: 4884734.956298597,
          z: 3401327.578186401,
        },
        orientation: {
          heading: 6.283185307179581,
          pitch: -1.5706820857483068,
          roll: 0,
        },
      });

      // this.viewer.zoomTo(this.viewer.entities);

      let loop_flag = 0;
      let times = all_time_positions.length; // 总的时刻数
      // 定时改变箭头的数据
      let entities = this.viewer.entities.values;

      // 切换不同帧
      let that = this;
      setInterval(function () {
        for (let ic = 0; ic < entities.length; ic++) {
          var ps = all_time_positions[loop_flag][ic];
          if (that.stopJsonShow) {
            entities[ic].polyline.positions =
              Cesium.Cartesian3.fromDegreesArrayHeights(ps);
            //entities[i].polyline.material = m;
          } else {
            break;
          }
        }

        loop_flag++;
        if (loop_flag >= times && that.stopJsonShow) {
          loop_flag = 0;
        }
      }, 3000);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../node_modules/cesium/Source/Widgets/widgets.css";

#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.info-title {
  position: absolute;
  left: 20px;
  top: 20px;
  opacity: 0.8;
}
</style>