<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
    <div id="toolbar" v-if="!startButton">
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
    </div>
    <!-- <div id="startbar" v-if="startButton">
      <button @click="startCesium" class="startbarItem">开始</button>
    </div> -->
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";

export default {
  name: "Cesium",
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
    };
  },
  mounted() {
    this.cesiumInit();
    // this.add3DTiles();
    // this.addPlane();
    // this.addKMZ();
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
        // animation: false,
        // timeline: false,
        fullscreenButton: false,
        vrButton: false,
      });
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
      this.viewer.camera.flyHome(8);
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
      // this.viewer.imageryLayers.get(0).show = false; //不显示底图
      // this.viewer.scene.globe.baseColor = Cesium.Color.WHITE; //设置地球颜色
      // 暂时添加本地瓦片
      // let zanshi = new Cesium.TileMapServiceImageryProvider({
      //   url: "dem_tiles5",
      //   fileExtension: "png",
      // });
      // this.viewer.imageryLayers.addImageryProvider(zanshi);
    },
    destroyMap() {
      this.viewer.destroy();
      this.viewer = null;
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
    firstPerspective() {
      if (!this.firstPerspectiveButton) {
        //第一视角
        console.log(this.viewer.trackedEntit);
        this.viewer.trackedEntity = this.airplane;
        this.viewer.scene.preUpdate.addEventListener(this.setRoamView);
        this.firstPerspectiveButton = true;
      } else {
        //退出第一视角
        this.viewer.trackedEntity = null;
        this.viewer.scene.preUpdate.removeEventListener(this.setRoamView);
        this.firstPerspectiveButton = false;
      }
    },
    addKMZ() {
      var options = {
        camera: this.viewer.scene.camera,
        canvas: this.viewer.scene.canvas,
        clampToGround: true, //开启贴地
      };
      this.viewer.dataSources
        .add(Cesium.KmlDataSource.load("data/dem_LayerToKML3.kmz", options))
        .then(function (dataSource) {
          var geocacheEntities = dataSource.entities.values;
          console.log(geocacheEntities);
        });
    },
    setRoamView() {
      if (this.airplane) {
        let center = this.airplane.position.getValue(
          this.viewer.clock.currentTime
        );
        // console.log(center);

        if (center) {
          // this.viewer.camera.setView({
          //   // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
          //   // fromDegrees()方法，将经纬度和高程转换为世界坐标
          //   destination: center,
          //   orientation: {
          //     // 指向
          //     heading: Cesium.Math.toRadians(90, 0),
          //     // 视角
          //     pitch: Cesium.Math.toRadians(-90),
          //     roll: 0.0,
          //   },
          // });
          let target = new Cesium.Cartesian3.fromDegrees(
            119.78432,
            31.91299,
            0
          );
          //   let vector = new Cesium.Cartesian3(
          //     0.5,
          //     -0.22,
          //     -0.01
          //   );
          // let nextPos = this.airplane.position.getValue(
          //   this.viewer.clock.currentTime + 1
          // );

          // let front = new Cesium.Cartesian3(
          //   nextPos.x - center.x,
          //   nextPos.y - center.y,
          //   nextPos.z - center.z,
          // );

          // front = Cesium.Cartesian3.normalize(front, new Cesium.Cartesian3());

          let pos = new Cesium.Cartesian3(
            target.x - center.x,
            target.y - center.y,
            target.z - center.z
          );
          let front = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3());
          // let hpr = new Cesium.HeadingPitchRange(
          //   Cesium.Math.toRadians(150, 0),
          //   Cesium.Math.toRadians(0),
          //   100
          // );
          this.viewer.camera.lookAt(center, front);
        }
      }
    },
    addPlane() {
      Cesium.Math.setRandomNumberSeed(3);
      var start = Cesium.JulianDate.fromDate(new Date(2022, 3, 13, 16));
      var stop = Cesium.JulianDate.addSeconds(
        start,
        180,
        new Cesium.JulianDate()
      );
      this.viewer.clock.startTime = start.clone();
      this.viewer.clock.stopTime = stop.clone();
      this.viewer.clock.currentTime = start.clone();
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      this.viewer.clock.multiplier = 10;
      this.viewer.timeline.zoomTo(start, stop);
      let flightPosition = this.computeCirclularFlight(start);
      // 机场信息
      let promise = Cesium.GeoJsonDataSource.load("data/ariPort.json", {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK.withAlpha(0.5),
        // strokeWidth: 3,
        markerSymbol: "airport",
      });
      let that = this;
      promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        that.airPort = dataSource;
        // // that.level1.show = false;
        that.airPort.show = true;
        that.showPlaneButton = true;
      });
      // 航线轨迹
      this.addAirline();

      // 航线信息
      this.airplane = this.viewer.entities.add({
        name: "上海浦东——常州奔牛",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        position: flightPosition,
        orientation: new Cesium.VelocityOrientationProperty(flightPosition),
        model: {
          uri: "data/model/airPlane/fbx.gltf",
          minimumPixelSize: 128,
          maximumScale: 9000,
        },
      });
      this.airplane.position.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: Cesium.LinearApproximation, //采用线性插值方法生成整体航线
      });
      // this.viewer.trackedEntity = airplane;
    },
    computeCirclularFlight(start) {
      var property = new Cesium.SampledPositionProperty();
      var time = Cesium.JulianDate.addSeconds(
        start,
        0,
        new Cesium.JulianDate()
      );
      var time2 = Cesium.JulianDate.addSeconds(
        start,
        60,
        new Cesium.JulianDate()
      );
      var time3 = Cesium.JulianDate.addSeconds(
        start,
        120,
        new Cesium.JulianDate()
      );
      var time4 = Cesium.JulianDate.addSeconds(
        start,
        180,
        new Cesium.JulianDate()
      );
      var position = Cesium.Cartesian3.fromDegrees(121.79, 31.15046, 0);
      var position2 = Cesium.Cartesian3.fromDegrees(121.12144, 31.40477, 8500);
      var position3 = Cesium.Cartesian3.fromDegrees(120.45288, 31.6599, 8500);
      var position4 = Cesium.Cartesian3.fromDegrees(119.78432, 31.91299, 0);
      property.addSample(time, position);
      property.addSample(time2, position2);
      property.addSample(time3, position3);
      property.addSample(time4, position4);
      return property;
    },
    addAirline() {
      var origin = [121.79, 31.15046]; //起始机场坐标
      var destination = [119.78432, 31.91299]; //目的机场坐标
      var dis = this.getGreatCircleDistance(
        origin[1],
        origin[0],
        destination[1],
        destination[0]
      ); //得到圆弧对应高度
      var pntArray = this.addBezier(origin, destination, 8500, 30); //生成贝塞尔曲线路线
      var color = new Cesium.Color(0.2, 0.9, 0.8, 0.8);
      var entity = new Cesium.Entity();
      entity.dep = "PVG";
      entity.arr = "CZX";
      entity.bezier = new Cesium.ConstantProperty(true);
      entity.bezier = true;
      entity.polyline = {
        name: "航线",
        positions: pntArray,
        width: 0.1,
        material: color,
      };
      entity.name = "航线信息";
      entity.description =
        "上海浦东-常州奔牛" + "<br/>" + "距离:   " + dis / 1000 + " KM";
      this.viewer.entities.add(entity);
      this.airLine = entity;
    },
    getGreatCircleDistance(lat1, lng1, lat2, lng2) {
      var EARTH_RADIUS = 6378137.0;
      var radLat1 = this.getRad(lat1);
      var radLat2 = this.getRad(lat2);
      var a = radLat1 - radLat2; //纬度差
      var b = this.getRad(lng1) - this.getRad(lng2); //经度差
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        ); //asin()相当于arcsin()
      s = s * EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000.0; //按千分位精确
      return s;
    },
    getRad(d) {
      let PI = Math.PI;
      return (d * PI) / 180.0;
    },
    addBezier(pointA, pointB, height, num) {
      var earth = Cesium.Ellipsoid.WGS84;
      var startPoint = earth.cartographicToCartesian(
        Cesium.Cartographic.fromDegrees(
          parseFloat(pointA[0]),
          parseFloat(pointA[1]),
          0.0
        )
      );
      var endPoint = earth.cartographicToCartesian(
        Cesium.Cartographic.fromDegrees(
          parseFloat(pointB[0]),
          parseFloat(pointB[1]),
          0.0
        )
      );
      // determine the midpoint (point will be inside the earth)
      var addCartesian = startPoint.clone();
      Cesium.Cartesian3.add(startPoint, endPoint, addCartesian);
      var midpointCartesian = addCartesian.clone();
      Cesium.Cartesian3.divideByScalar(addCartesian, 2, midpointCartesian);
      // move the midpoint to the surface of the earth
      earth.scaleToGeodeticSurface(midpointCartesian);
      // add some altitude if you want (1000 km in this case)
      var midpointCartographic =
        earth.cartesianToCartographic(midpointCartesian);
      midpointCartographic.height = height;
      midpointCartesian = earth.cartographicToCartesian(midpointCartographic);
      var spline = new Cesium.CatmullRomSpline({
        times: [0.0, 0.5, 1.0],
        points: [startPoint, midpointCartesian, endPoint],
      });
      var polylinePoints = [];
      for (var ii = 0; ii < num; ++ii) {
        polylinePoints.push(spline.evaluate(ii / num));
      }
      return polylinePoints;
    },
    showPlane() {
      if (this.airplane == null) {
        this.addPlane();
      } else if (!this.showPlaneButton) {
        this.airplane.show = true;
        this.airLine.show = true;
        this.airPort.show = true;
        this.showPlaneButton = true;
      } else {
        this.airplane.show = false;
        this.airLine.show = false;
        this.airPort.show = false;
        this.showPlaneButton = false;
        //退出第一视角
        this.viewer.trackedEntity = null;
        this.viewer.scene.preUpdate.removeEventListener(this.setRoamView);
        this.firstPerspectiveButton = false;
      }
    },
    add3DTiles() {
      // 加载3DTiles数据
      this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "data/tileset.json",
          // url: "data/level_3dtiles_clt/tileset.json",
          maximumScreenSpaceError: 2, //最大的屏幕空间误差
          maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
          material: Cesium.Color.PINK.withAlpha(0.5),
        })
      );
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

<style lang="less" scoped>
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
  // top: 0px;
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
</style>