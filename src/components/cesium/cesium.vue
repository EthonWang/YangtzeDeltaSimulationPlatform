<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
    <!-- <div id="toolbar" v-if="!startButton">
      <button @click="showProvince" class="toolbarItem">中国行政区划</button>
      <button @click="showProvince2" class="toolbarItem">
        中国行政区划(界线)
      </button>
      <button @click="showLevel1" class="toolbarItem">一级地名</button>
      <button @click="showLevel2" class="toolbarItem">二级地名</button>
      <button @click="showLevel3" class="toolbarItem">三级地名</button>
      <button @click="showDock" class="toolbarItem">码头</button>
      <button @click="showPlane" class="toolbarItem">航班模拟</button>
      <button
        @click="firstPerspective"
        class="toolbarItem"
        v-if="showPlaneButton"
      >
        第一视角飞行
      </button>
    </div> -->
    <!-- <div id="startbar" v-if="startButton">
      <button @click="startCesium" class="startbarItem">开始</button>
    </div> -->
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import axios from "axios";
import proj4 from "proj4";

export default {
  name: "Cesium",
  props: ["tifList", "jsonList"],
  data() {
    return {
      viewer: null,
      startButton: false,
      redBox: null,
      ellipse: null,
      province: null,
      province2: null,
      level1: null,
      level2: null,
      level3: null,
      dock: null,
      airplane: null,
      airLine: null,
      airPort: null,
      showProvinceButton: false,
      showProvinceButton2: false,
      showLevel1Button: false,
      showLevel2Button: false,
      showLevel3Button: false,
      showDockButton: false,
      showPlaneButton: false,
      firstPerspectiveButton: false,
      loadedTifList: [],
      loadedTifIdList: [],
      projection: "+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs ",
      fromProjection:
        "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
      newProjection: `+proj=longlat +datum=WGS84 +no_defs`,
      stopJsonShow: false,
      jsonFileData: [],
    };
  },
  watch: {
    tifList(value) {
      this.updateTifShow(value);
    },
    jsonList(value) {
      this.updateJsonListShow(value);
    },
  },
  mounted() {
    this.cesiumInit();
    // this.add3DTiles();
    // this.addPlane();
    // this.addKMZ();
    // this.addJsonList();
    // this.addGltf();
  },
  methods: {
    cesiumInit() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2RjODQxYy0xNDI0LTRmNmYtOTJjNy02Njk3NGFmNGZlMzMiLCJpZCI6ODg1MTgsImlhdCI6MTY0OTI1MzIzNn0._0nz9pC6RF2dXjkzTilweCdZOP6jE-9Efc1QqjMOR_Q";
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        // terrainProvider: Cesium.createWorldTerrain(),
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
    },
    destroyMap() {
      this.viewer.destroy();
      this.viewer = null;
    },
    updateTifShow(list) {
      // 添加增加的tif，隐藏减少的tif
      // 检查是否已经被加载过
      for (let i = 0; i < list.length; i++) {
        let exist = false;
        for (let j = 0; j < this.loadedTifIdList.length; j++) {
          if (list[i].dataSourceId == this.loadedTifIdList[j]) {
            exist = true;
          }
        }
        if (!exist) {
          // 判断是否已经添加
          this.loadedTifIdList.push(list[i].dataSourceId);
          list[i].loaded = false;
          this.loadedTifList.push(list[i]);
          this.addKMZ(this.loadedTifList.length - 1);
        }
      }
      // 隐藏已经加载过，但本次不在list中的tif
      // 显示已经加载过，仍在本次list中的tif
      for (let i = 0; i < this.loadedTifIdList.length; i++) {
        let exist = false;
        for (let j = 0; j < list.length; j++) {
          if (list[j].dataSourceId == this.loadedTifIdList[i]) {
            exist = true;
          }
        }
        if (!exist && this.loadedTifList[i].loaded) {
          // 需要隐藏
          this.loadedTifList[i].geocacheEntities[0].show = false;
        } else if (exist && this.loadedTifList[i].loaded) {
          this.loadedTifList[i].geocacheEntities[0].show = true;
        }
      }
    },
    addKMZ(index) {
      this.loadedTifList[index].geocacheEntities = [];
      var options = {
        camera: this.viewer.scene.camera,
        canvas: this.viewer.scene.canvas,
        clampToGround: true, //开启贴地
      };
      let that = this;
      this.viewer.dataSources
        .add(
          Cesium.KmlDataSource.load(
            "http://172.21.212.63:8999/store" + this.loadedTifList[index].path,
            options
          )
        )
        .then(function (dataSource) {
          let geocacheEntities = dataSource.entities.values;
          that.loadedTifList[index].geocacheEntities = geocacheEntities;
          that.loadedTifList[index].loaded = true;
        });
    },
    updateJsonListShow(list) {
      if (list.length == 0) {
        this.viewer.entities.removeAll();
        this.stopJsonShow = false;
      } else {
        this.getJsonList(list[0]);
        this.stopJsonShow = true;
      }
    },
    getJsonList(item) {
      let fileNameList = ["speed_start.json", "speed_end.json"];
      let tempDataList = [];
      for (let i = 0; i < fileNameList.length; i++) {
        let path = item.path.replace("color.json", fileNameList[i]);
        axios.get("http://172.21.212.63:8999/store" + path).then((res) => {
          tempDataList[i] = res.data;
        });
        if (i == 1) {
          let that = this;
          setTimeout(function () {
            that.addJsonList(tempDataList);
          }, 1000);
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
          one_time_positions.push([p1[0] + 8.15, p1[1], p2[0] + 8.15, p2[1]]);

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
            positions: Cesium.Cartesian3.fromDegreesArray(ps),
            width: 5,
            followSurface: true,
            material: new Cesium.PolylineArrowMaterialProperty(
              Cesium.Color.BLUE
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
        for (let i = 0; i < entities.length; i++) {
          var ps = all_time_positions[loop_flag][i];
          if (that.stopJsonShow) {
            entities[i].polyline.positions =
              Cesium.Cartesian3.fromDegreesArray(ps);
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
    startCesium() {
      this.startButton = false;
      this.viewer.camera.flyHome(4);
      this.viewer.scene.debugShowFramesPerSecond = true; //显示帧数
      document.getElementsByClassName(
        "cesium-viewer-toolbar"
      )[0].style.display = "block";
      document.getElementsByClassName(
        "cesium-viewer-animationContainer"
      )[0].style.display = "";
      document.getElementsByClassName(
        "cesium-viewer-timelineContainer"
      )[0].style.display = "";
    },
    // firstPerspective() {
    //   if (!this.firstPerspectiveButton) {
    //     //第一视角
    //     this.viewer.trackedEntity = this.airplane;
    //     this.viewer.scene.preUpdate.addEventListener(this.setRoamView);
    //     this.firstPerspectiveButton = true;
    //   } else {
    //     //退出第一视角
    //     this.viewer.trackedEntity = null;
    //     this.viewer.scene.preUpdate.removeEventListener(this.setRoamView);
    //     this.firstPerspectiveButton = false;
    //   }
    // },
    // setRoamView() {
    //   if (this.airplane) {
    //     let center = this.airplane.position.getValue(
    //       this.viewer.clock.currentTime
    //     );
    //     if (center) {
    //       // this.viewer.camera.setView({
    //       //   // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
    //       //   // fromDegrees()方法，将经纬度和高程转换为世界坐标
    //       //   destination: center,
    //       //   orientation: {
    //       //     // 指向
    //       //     heading: Cesium.Math.toRadians(90, 0),
    //       //     // 视角
    //       //     pitch: Cesium.Math.toRadians(-90),
    //       //     roll: 0.0,
    //       //   },
    //       // });
    //       let target = new Cesium.Cartesian3.fromDegrees(
    //         119.78432,
    //         31.91299,
    //         0
    //       );
    //       //   let vector = new Cesium.Cartesian3(
    //       //     0.5,
    //       //     -0.22,
    //       //     -0.01
    //       //   );
    //       // let nextPos = this.airplane.position.getValue(
    //       //   this.viewer.clock.currentTime + 1
    //       // );

    //       // let front = new Cesium.Cartesian3(
    //       //   nextPos.x - center.x,
    //       //   nextPos.y - center.y,
    //       //   nextPos.z - center.z,
    //       // );

    //       // front = Cesium.Cartesian3.normalize(front, new Cesium.Cartesian3());

    //       let pos = new Cesium.Cartesian3(
    //         target.x - center.x,
    //         target.y - center.y,
    //         target.z - center.z
    //       );
    //       let front = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());
    //       // let hpr = new Cesium.HeadingPitchRange(
    //       //   Cesium.Math.toRadians(150, 0),
    //       //   Cesium.Math.toRadians(0),
    //       //   100
    //       // );
    //       this.viewer.camera.lookAt(center, front);
    //     }
    //   }
    // },
    addGltf() {
      let box = this.viewer.entities.add({
        name: "gltf",
        // position: new Cesium.Cartesian3(
        //   1327713.5649879673,
        //   -4644925.129053015,
        //   4153499.5031920094
        // ),
        position: new Cesium.Cartesian3(
          1327881.91755585,
          -4153731.06261319,
          -4644670.03394715
        ),
        model: {
          uri: "data/model/gltf/box.gltf",
          minimumPixelSize: 1280,
          maximumScale: 9000,
        },
      });
      // this.viewer.camera.lookAt(box.position);
      console.log(box.position._value);
      // this.viewer.camera.setView({
      //   // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
      //   // fromDegrees()方法，将经纬度和高程转换为世界坐标
      //   destination: Cesium.Cartesian3.fromDegrees(121.79, 31.15046, 1000),
      //   orientation: {
      //     // 指向
      //     heading: Cesium.Math.toRadians(90, 0),
      //     // 视角
      //     pitch: Cesium.Math.toRadians(-90),
      //     roll: 0.0,
      //   },
      // });
    },
    // addPlane() {
    //   Cesium.Math.setRandomNumberSeed(3);
    //   var start = Cesium.JulianDate.fromDate(new Date(2022, 3, 13, 16));
    //   var stop = Cesium.JulianDate.addSeconds(
    //     start,
    //     180,
    //     new Cesium.JulianDate()
    //   );
    //   this.viewer.clock.startTime = start.clone();
    //   this.viewer.clock.stopTime = stop.clone();
    //   this.viewer.clock.currentTime = start.clone();
    //   this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    //   this.viewer.clock.multiplier = 10;
    //   this.viewer.timeline.zoomTo(start, stop);
    //   let flightPosition = this.computeCirclularFlight(start);
    //   // 机场信息
    //   let promise = Cesium.GeoJsonDataSource.load("data/ariPort.json", {
    //     stroke: Cesium.Color.HOTPINK,
    //     fill: Cesium.Color.PINK.withAlpha(0.5),
    //     // strokeWidth: 3,
    //     markerSymbol: "airport",
    //   });
    //   let that = this;
    //   promise.then(function (dataSource) {
    //     that.viewer.dataSources.add(dataSource);
    //     that.airPort = dataSource;
    //     // // that.level1.show = false;
    //     that.airPort.show = true;
    //     that.showPlaneButton = true;
    //   });
    //   // 航线轨迹
    //   this.addAirline();

    //   // 航线信息
    //   this.airplane = this.viewer.entities.add({
    //     name: "上海浦东——常州奔牛",
    //     availability: new Cesium.TimeIntervalCollection([
    //       new Cesium.TimeInterval({
    //         start: start,
    //         stop: stop,
    //       }),
    //     ]),
    //     position: flightPosition,
    //     orientation: new Cesium.VelocityOrientationProperty(flightPosition),
    //     model: {
    //       uri: "data/model/airPlane/fbx.gltf",
    //       minimumPixelSize: 128,
    //       maximumScale: 9000,
    //     },
    //   });
    //   this.airplane.position.setInterpolationOptions({
    //     interpolationDegree: 5,
    //     interpolationAlgorithm: Cesium.LinearApproximation, //采用线性插值方法生成整体航线
    //   });
    //   // this.viewer.trackedEntity = airplane;
    // },
    // computeCirclularFlight(start) {
    //   var property = new Cesium.SampledPositionProperty();
    //   var time = Cesium.JulianDate.addSeconds(
    //     start,
    //     0,
    //     new Cesium.JulianDate()
    //   );
    //   var time2 = Cesium.JulianDate.addSeconds(
    //     start,
    //     60,
    //     new Cesium.JulianDate()
    //   );
    //   var time3 = Cesium.JulianDate.addSeconds(
    //     start,
    //     120,
    //     new Cesium.JulianDate()
    //   );
    //   var time4 = Cesium.JulianDate.addSeconds(
    //     start,
    //     180,
    //     new Cesium.JulianDate()
    //   );
    //   var position = Cesium.Cartesian3.fromDegrees(121.79, 31.15046, 0);
    //   var position2 = Cesium.Cartesian3.fromDegrees(121.12144, 31.40477, 8500);
    //   var position3 = Cesium.Cartesian3.fromDegrees(120.45288, 31.6599, 8500);
    //   var position4 = Cesium.Cartesian3.fromDegrees(119.78432, 31.91299, 0);
    //   property.addSample(time, position);
    //   property.addSample(time2, position2);
    //   property.addSample(time3, position3);
    //   property.addSample(time4, position4);
    //   return property;
    // },
    // addAirline() {
    //   var origin = [121.79, 31.15046]; //起始机场坐标
    //   var destination = [119.78432, 31.91299]; //目的机场坐标
    //   var dis = this.getGreatCircleDistance(
    //     origin[1],
    //     origin[0],
    //     destination[1],
    //     destination[0]
    //   ); //得到圆弧对应高度
    //   var pntArray = this.addBezier(origin, destination, 8500, 30); //生成贝塞尔曲线路线
    //   var color = new Cesium.Color(0.2, 0.9, 0.8, 0.8);
    //   var entity = new Cesium.Entity();
    //   entity.dep = "PVG";
    //   entity.arr = "CZX";
    //   entity.bezier = new Cesium.ConstantProperty(true);
    //   entity.bezier = true;
    //   entity.polyline = {
    //     name: "航线",
    //     positions: pntArray,
    //     width: 0.1,
    //     material: color,
    //   };
    //   entity.name = "航线信息";
    //   entity.description =
    //     "上海浦东-常州奔牛" + "<br/>" + "距离:   " + dis / 1000 + " KM";
    //   this.viewer.entities.add(entity);
    //   this.airLine = entity;
    // },
    // getGreatCircleDistance(lat1, lng1, lat2, lng2) {
    //   var EARTH_RADIUS = 6378137.0;
    //   var radLat1 = this.getRad(lat1);
    //   var radLat2 = this.getRad(lat2);
    //   var a = radLat1 - radLat2; //纬度差
    //   var b = this.getRad(lng1) - this.getRad(lng2); //经度差
    //   var s =
    //     2 *
    //     Math.asin(
    //       Math.sqrt(
    //         Math.pow(Math.sin(a / 2), 2) +
    //           Math.cos(radLat1) *
    //             Math.cos(radLat2) *
    //             Math.pow(Math.sin(b / 2), 2)
    //       )
    //     ); //asin()相当于arcsin()
    //   s = s * EARTH_RADIUS;
    //   s = Math.round(s * 10000) / 10000.0; //按千分位精确
    //   return s;
    // },
    // getRad(d) {
    //   let PI = Math.PI;
    //   return (d * PI) / 180.0;
    // },
    // addBezier(pointA, pointB, height, num) {
    //   var earth = Cesium.Ellipsoid.WGS84;
    //   var startPoint = earth.cartographicToCartesian(
    //     Cesium.Cartographic.fromDegrees(
    //       parseFloat(pointA[0]),
    //       parseFloat(pointA[1]),
    //       0.0
    //     )
    //   );
    //   var endPoint = earth.cartographicToCartesian(
    //     Cesium.Cartographic.fromDegrees(
    //       parseFloat(pointB[0]),
    //       parseFloat(pointB[1]),
    //       0.0
    //     )
    //   );
    //   // determine the midpoint (point will be inside the earth)
    //   var addCartesian = startPoint.clone();
    //   Cesium.Cartesian3.add(startPoint, endPoint, addCartesian);
    //   var midpointCartesian = addCartesian.clone();
    //   Cesium.Cartesian3.divideByScalar(addCartesian, 2, midpointCartesian);
    //   // move the midpoint to the surface of the earth
    //   earth.scaleToGeodeticSurface(midpointCartesian);
    //   // add some altitude if you want (1000 km in this case)
    //   var midpointCartographic =
    //     earth.cartesianToCartographic(midpointCartesian);
    //   midpointCartographic.height = height;
    //   midpointCartesian = earth.cartographicToCartesian(midpointCartographic);
    //   var spline = new Cesium.CatmullRomSpline({
    //     times: [0.0, 0.5, 1.0],
    //     points: [startPoint, midpointCartesian, endPoint],
    //   });
    //   var polylinePoints = [];
    //   for (var ii = 0; ii < num; ++ii) {
    //     polylinePoints.push(spline.evaluate(ii / num));
    //   }
    //   return polylinePoints;
    // },
    // showPlane() {
    //   if (this.airplane == null) {
    //     this.addPlane();
    //   } else if (!this.showPlaneButton) {
    //     this.airplane.show = true;
    //     this.airLine.show = true;
    //     this.airPort.show = true;
    //     this.showPlaneButton = true;
    //   } else {
    //     this.airplane.show = false;
    //     this.airLine.show = false;
    //     this.airPort.show = false;
    //     this.showPlaneButton = false;
    //     //退出第一视角
    //     this.viewer.trackedEntity = null;
    //     this.viewer.scene.preUpdate.removeEventListener(this.setRoamView);
    //     this.firstPerspectiveButton = false;
    //   }
    // },
    add3DTiles() {
      // 加载3DTiles数据
      // debugger;
      let tileset = new Cesium.Cesium3DTileset({
        // url: "data/model/3dtilesFromGltf/tileset.json",
        url: "http://172.21.213.44:8097/static/resRepository/220829_raw_3141626272517_13-14/testOffline_autoTest/tileset/tileset.json",
        // url: "data/model/obj2Tiles/tileset.json",
        // url: "data/level_3dtiles_clt/tileset.json",
        maximumScreenSpaceError: 2, //最大的屏幕空间误差
        maximumNumberOfLoadedTiles: 10000, //最大加载瓦片个数
        // modelMatrix: myTransform,
      });
      let that = this;
      tileset.readyPromise.then(function (tilesetData) {
        // debugger;
        // let center = tilesetData.boundingSphere.center; //正球投影中心
        // let lonlat = that.webMercator2lonLat(center); //经纬度
        // let ellipsoidCenter = Cesium.Cartesian3.fromDegrees(
        //   lonlat.x,
        //   lonlat.y,
        //   lonlat.z
        // ); //椭球投影中心
        let m = Cesium.Matrix4.fromArray([
          1.0,
          0.0,
          0.0,
          0.0,
          0.0,
          1.0,
          0.0,
          0.0,
          0.0,
          0.0,
          1.0,
          0.0,
          0,
          0,
          25,
          1.0,
        ]); //偏差矩阵
        tilesetData.modelMatrix = m;
      });
      this.viewer.scene.primitives.add(tileset);
      // this.viewer.zoomTo(tileset);
      // var clickHandler = this.viewer.screenSpaceEventHandler.getInputAction(
      //   Cesium.ScreenSpaceEventType.LEFT_CLICK
      // );
    },
    webMercator2lonLat(mercator) {
      let lonlat = { x: 0, y: 0, z: 0 };
      let pi = Math.PI;
      let R = Math.sqrt(
        mercator.x * mercator.x +
          mercator.y * mercator.y +
          mercator.z * mercator.z
      );
      let Latitude = (180.0 / pi) * Math.atan2(mercator.y, mercator.x);
      let Longitude = (180.0 / pi) * Math.asin(mercator.z / R);
      let Height = R - 6371010;
      lonlat.x = Latitude;
      lonlat.y = Longitude;
      lonlat.z = Height;
      return lonlat;
    },

    addGeoJSON_level1() {
      // 加载GeoJSON数据
      let promise = Cesium.GeoJsonDataSource.load(
        "data/level1_Project_FeaturesToJSON.json",
        {
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          // strokeWidth: 3,
          markerSymbol: "1",
        }
      );
      let that = this;
      promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        that.level1 = dataSource;
        // that.level1.show = false;
        that.level1.show = true;
        that.showLevel1Button = true;
      });
    },
    showLevel1() {
      if (this.level1 == null) {
        this.addGeoJSON_level1();
      } else if (!this.showLevel1Button) {
        this.level1.show = true;
        this.showLevel1Button = true;
      } else {
        this.level1.show = false;
        this.showLevel1Button = false;
      }
    },
    addGeoJSON_level2() {
      // 加载GeoJSON数据
      let promise = Cesium.GeoJsonDataSource.load(
        "data/level2_Project_FeaturesToJSON.json",
        {
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          // strokeWidth: 3,
          markerSymbol: "2",
          markerColor: Cesium.Color.PINK.withAlpha(1),
        }
      );
      let that = this;
      promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        that.level2 = dataSource;
        that.level2.show = true;
        that.showLevel2Button = true;
      });
    },
    showLevel2() {
      if (this.level2 == null) {
        this.addGeoJSON_level2();
      } else if (!this.showLevel2Button) {
        this.level2.show = true;
        this.showLevel2Button = true;
      } else {
        this.level2.show = false;
        this.showLevel2Button = false;
      }
    },
    addGeoJSON_level3() {
      // 加载GeoJSON数据
      let promise = Cesium.GeoJsonDataSource.load(
        "data/level3_Project_FeaturesToJSON.json",
        {
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          // strokeWidth: 3,
          markerSymbol: "3",
          markerColor: Cesium.Color.YELLOW.withAlpha(1),
        }
      );
      let that = this;
      promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        that.level3 = dataSource;
        that.level3.show = true;
        that.showLevel3Button = true;
      });
    },
    showLevel3() {
      if (this.level3 == null) {
        this.addGeoJSON_level3();
      } else if (!this.showLevel3Button) {
        this.level3.show = true;
        this.showLevel3Button = true;
      } else {
        this.level3.show = false;
        this.showLevel3Button = false;
      }
    },
    addGeoJSON_dock() {
      // 加载GeoJSON数据
      let promise = Cesium.GeoJsonDataSource.load(
        "data/dock2_Project1_FeaturesToJSON.json",
        {
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          // strokeWidth: 3,
        }
      );
      let that = this;

      promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        var colorHash = {};
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];
          var colorNum = entity.properties.Color._value;
          var color = colorHash["Color_" + colorNum];
          if (!color) {
            color = Cesium.Color.fromRandom({
              alpha: 1.0,
            });
            colorHash["Color_" + colorNum] = color;
          }
          entity.polyline.material = color;
          entity.polyline.outline = false;
        }
        that.dock = dataSource;
        that.dock.show = true;
        that.showDockButton = true;
      });
    },
    showDock() {
      if (this.dock == null) {
        this.addGeoJSON_dock();
      } else if (!this.showDockButton) {
        this.dock.show = true;
        this.showDockButton = true;
      } else {
        this.dock.show = false;
        this.showDockButton = false;
      }
    },

    addProvince() {
      //中国行政区划图
      let promise = new Cesium.GeoJsonDataSource().load(
        "data/CN_province.json",
        {
          // fill: Cesium.Color.fromAlpha(Cesium.Color.RED, 0), //设置填充透明
        }
      );
      let that = this;
      promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        var colorHash = {};
        // console.log(entities);
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];
          var name = entity.name;
          var color = colorHash[name];
          if (!color) {
            color = Cesium.Color.fromRandom({
              alpha: 1.0,
            });
            colorHash[name] = color;
          }
          entity.polygon.material = color;
          entity.polygon.outline = false;
          entity.polygon.extrudedHeight = 5000.0;
        }
        that.province = dataSource;
        that.province.show = true;
        that.showProvinceButton = true;
      });
      console.log("行政区划图加载成功！");
    },
    addProvince2() {
      //中国行政区划图
      let promise = new Cesium.GeoJsonDataSource().load(
        "data/CN_province.json",
        {
          fill: Cesium.Color.fromAlpha(Cesium.Color.RED, 0.01), //设置填充透明
        }
      );
      let that = this;
      promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        that.province2 = dataSource;
        that.province2.show = true;
        that.showProvinceButton2 = true;
      });
      console.log("行政区划图2加载成功！");
    },
    showProvince() {
      if (this.province == null) {
        this.addProvince();
      } else if (!this.showProvinceButton) {
        this.province.show = true;
        this.showProvinceButton = true;
      } else {
        this.province.show = false;
        this.showProvinceButton = false;
      }
    },
    showProvince2() {
      if (this.province2 == null) {
        this.addProvince2();
      } else if (!this.showProvinceButton2) {
        this.province2.show = true;
        this.showProvinceButton2 = true;
      } else {
        this.province2.show = false;
        this.showProvinceButton2 = false;
      }
    },
    addShpfile() {},
  },
  beforeUnmount() {
    this.destroyMap();
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
.box {
  height: 100%;
  position: relative;
}
#toolbar {
  position: absolute;
  right: 0px;
  bottom: 300px;
  background-color: rgb(55, 55, 55);
  padding: 20px 20px;
  border-radius: 10%;
  display: flex;
  flex-direction: column;
}
.toolbarItem {
  margin-bottom: 10px;
}
#startbar {
  position: absolute;
  top: 20%;
  left: 46%;
}
.startbarItem {
  width: 150px;
  height: 50px;
  background-color: transparent;
  border: 1 white;
  border-radius: 10%;
  font-size: 20px;
  font-weight: 600;
  color: white;
  cursor: pointer;
}
.startbarItem:hover {
  background-color: rgb(62, 61, 61);
}
::v-deep .cesium-performanceDisplay-defaultContainer {
  position: absolute;
  top: 142px !important;
  right: 30px;
}
::v-deep .cesium-viewer .cesium-viewer-toolbar {
  /*镶嵌带空格*/
  display: block;
  position: absolute;
  top: 102px !important;
  right: 25px;
}
</style>