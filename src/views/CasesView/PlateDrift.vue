<template>
  <div>
    <div id="cesiumContainer">
      <div class="btnBox">
        <el-button
          class="cesium-animation-buttonMain"
          type="primary"
          color="#363636"
          :disabled="!isplaying"
          @click="play"
        >
          <el-icon><VideoPlay /></el-icon>
        </el-button>
        <el-button
          type="primary"
          color="#363636"
          :disabled="isplaying"
          @click="stop"
        >
          <el-icon><VideoPause /></el-icon>
        </el-button>
        <el-button
          type="primary"
          color="#363636"
          :disabled="!isplaying"
          @click="reset"
        >
          重置
        </el-button>
        <el-button
          type="primary"
          color="#363636"
          @click="changegrid(this.gridIsshown)"
        >
          {{ grid }}
        </el-button>
        <el-button type="primary" color="#363636" @click="help">
          帮助
        </el-button>
        <el-select
          v-model="value"
          placeholder="3D视图"
          :popper-append-to-body="false"
          @change="changeview"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="this.time"
          :placeholder="this.time + 'Ma'"
          :popper-append-to-body="false"
          @change="changetime"
        >
          <el-option
            v-for="item in timelist"
            :key="item.tm"
            :label="item.label"
            :value="item.tm"
            :disabled="!isplaying"
          >
          </el-option>
        </el-select>
      </div>
      <div class="timebar">
        <span>{{ time }}MA</span>
      </div>
      <div class="info">
        <a href="javascript:;" @click="changestatus">&lt;</a>
        <div class="infobox">
          <p>
            {{ para1 }}
          </p>
          <p>
            {{ para2 }}
          </p>
          <p>
            {{ para3 }}
          </p>
          <p>
            {{ para4 }}
          </p>
          <p>
            {{ para5 }}
          </p>
          <p>
            {{ para6 }}
          </p>
          <p>
            {{ para7 }}
          </p>
        </div>
      </div>
      <div class="location">lon:{{ lon }},lat:{{ lat }}</div>
    </div>
  </div>
</template>

<script>
//采用vue2写法的话把setup去掉，
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Cesium from "cesium/Cesium";
import axios from "axios";
// import
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
export default {
  name: "Plate",
  data() {
    return {
      para1:
        "\xa0\xa0\xa0\xa0\xa0\xa0\xa0地球自45亿年前诞生以来，一直在不停地演化。从一个熔融状态的火球逐渐冷却，不仅演化出水圈和大气圈、以及生物圈，同时作为固体地球表层的地壳也在不停地变化，以每年几厘米的速度发生移动，导致地球上各大陆板块时而分开，时而拼合在一起形成超级大陆。中国大陆也是由多个陆块在漫长的地质历史时期逐渐聚合而成",
      para2:
        "\xa0\xa0\xa0\xa0\xa0\xa0\xa0中国大陆主要包含三个大的古老陆块：华北板块、华南板块和塔里木板块。各板块在拼合过程中，其间的边界则形成缝合带或造山带。其中，华北和华南板块汇聚而产生的中央造山带（秦岭-大别山或秦岭-大别-苏鲁造山带），横亘在中国中部，全长超过4000公里。其特殊的地理位置和构造属性不仅构成长江、黄河、淮河水系的分水岭，也是划分中国南北气候、自然地理和社会生活习俗的天然界线，因此也被称为中国的脊梁。",
      para3:
        "\xa0\xa0\xa0\xa0\xa0\xa0\xa0华北板块是世界上最古老的陆块之一，已知最老的岩石形成于38亿年前，经过25亿年和18亿年等多期造山事件，最终拼合称为一个统一的稳定大陆克拉通，并成为18亿年前的哥伦比亚超大陆的一部分。华南陆块已知最老的岩石形成于33亿年以前，并经历了从新太古至新元古代的一系列构造演化，并成为10亿年前的罗迪尼亚超大陆的一部分。在寒武纪之前，华北板块与华南板块相隔千里，可能一直未曾蒙面。",
      para4:
        "\xa0\xa0\xa0\xa0\xa0\xa0\xa0在显生宙（5.4亿年以来），从罗迪尼亚超级大陆裂解出来的陆块开始了重新组合的时代，也是这一时期，组成中国大陆的各个陆块开始了漫长复杂的汇聚历史。在寒武纪，由于洋壳的俯冲消减，祁连-北秦岭微陆块逐渐与华北板块南缘靠近，并最终在5～4.8亿年之前相遇，并发生碰撞。此外，在5～4亿年之间，祁连-北秦岭微陆块南缘的洋壳（商丹洋）持续发生俯冲消减，并形成了一个岩浆弧，产生了规模的岩浆岩以及变质作用。",
      para5:
        "\xa0\xa0\xa0\xa0\xa0\xa0\xa0在4-2.5亿年的海西构造期，构成后世中国大陆北部的零散地块开始向北漂移、汇聚增生。介于西伯利亚板块和华北板块、塔里木板块之间的古亚洲洋逐渐闭合，形成中亚（蒙古-兴安）造山带。使华北和塔里木板块最终与西伯利亚板块拼合。沿这一造山带发生了大规模的岩浆活动，不仅是多个板块拼合在一起，还有大量新生地壳物质的产生。而在华北板块的南缘，与华南板块之间的古特提斯洋也在向北俯冲消减于华北板块之下，在南秦岭形成了一系列泥盆-石炭纪的增生杂岩以及弧前沉积物。在这过程中也有大量岩石随着俯冲洋壳带到地壳深部，发生强烈的变质。并形成了以浒湾石炭纪榴辉岩、秦岭武关-刘岭杂岩为代表的石炭纪变质带。",
      para6:
        "\xa0\xa0\xa0\xa0\xa0\xa0\xa0在三叠纪，古特提斯洋最终闭合，华南板块与已经拼合到欧亚板块之上的华北板块发生碰撞，拼合在一起，并形成横贯中国中部的秦岭-大别山-苏鲁碰撞造山带。研究表明，华南板块北缘的地壳物质曾俯冲到华北板块之下一百多公里。几乎与此同时，位于华南板块西南部的思茅-印度支那板块也与华南板块碰撞拼合，之间形成金沙江碰撞带的南段。三叠纪晚期，保山-中缅马苏地块拼合到华南板块之上，之间形成澜沧江碰撞带的南段。",
      para7:
        "\xa0\xa0\xa0\xa0\xa0\xa0\xa0复杂的地质演化史造就了我国的秀美山川，但是也带来了巨大的隐患。板块的拼合地带，就是不稳定带，在拼合的时候，其情形就仿佛是今天的日本，火山地震频频来袭；拼合结束以后，也很容易受到外力的影响而活化，这就是当今的我国地质灾害严重的重要原因。",
      // dataSources: null,
      // graticuleLayer: "",
      // graticuleLayerprovider: "",
      drawer: false,
      lon: 0,
      lat: 0,
      timelist: [],
      layercount: 0,
      isplaying: true,
      value: "",
      time: 410,
      timer: null,
      timer2: null,
      grid: "打开格网",
      mode: "3D",
      stat: true,
      gridIsshown: false,
      options: [
        {
          value: "3D",
          label: "3D视图",
        },
        {
          value: "2D",
          label: "2D视图",
        },
        {
          value: "ColumBus",
          label: "哥伦布视图",
        },
      ],
      dataServer: useStore().state.devIpAddress,
      imageUrl:"/store/platecase_img/raster_Topography_410.00Ma.png",
    };
  },
  components: {},
  created() {
    this.InitTimelist();
  },
  mounted() {
    this.imageUrl = this.dataServer + this.imageUrl;
    this.Init();
  },
  updated() {
    const csvt = document.querySelector(".cesium-infoBox-title");
    const csbt = document.querySelector(".cesium-infoBox-camera");
    csvt.style = "font-size:20px;line-height:25px;";
    csbt.style = "display:none";
  },
  methods: {
    async requireJsonData(filepath) {
      const { data: czml } = await axios.get(filepath);
      const shp = Cesium.CzmlDataSource.load(czml);
      let julianDT = new Cesium.JulianDate();
      shp.then((result) => {
        // console.log(result);
        result.clock.multiplier = 0.5;
        result.clock.clockRange = Cesium.ClockRange.CLAMPED;
        result.clock.currentTime = Cesium.JulianDate.addSeconds(
          Cesium.JulianDate.fromIso8601("2012-08-04T16:00:00Z"),
          410 - this.time,
          julianDT
        );
      });
      this.viewer.dataSources.add(shp);
      this.viewer.zoomTo(shp);
    },
    async requirePngData() {
      const data = await axios({
        method: "GET",
        url: this.dataServer + "/store/platecase_img/raster_Topography_" + this.time + ".00Ma.png",
        responseType: "arraybuffer",
      })
        .then((response) => {
          //解析响应对象
          // console.log(response);
          this.imageUrl =
            "data:image/png;base64," +
            btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
        })
        .catch((error) => {
          console.log(error);
        });
      const imageryLayers = this.viewer.scene.imageryLayers;
      var imagelayer = new Cesium.SingleTileImageryProvider({
        url: this.imageUrl,
      });
      // console.log(this.layercount);
      if (this.gridIsshown) {
        imageryLayers.addImageryProvider(imagelayer, this.layercount - 1);
        this.layercount++;
        if (this.layercount >= 4) {
          imageryLayers.remove(imageryLayers._layers[0]);
          this.layercount--;
        }
      } else {
        imageryLayers.addImageryProvider(imagelayer, this.layercount);
        this.layercount++;
        if (this.layercount >= 3) {
          imageryLayers.remove(imageryLayers._layers[0]);
          this.layercount--;
        }
      }
    },
    help() {
      this.$alert(
        `使用鼠标滚轮进行缩放、
        鼠标左键进行地球的旋转、
        shift+鼠标左键进行画面的平移、
        ctrl+鼠标左键进行画面的旋转。`,
        "帮助",
        {
          confirmButtonText: "确定",
        }
      );
    },
    changestatus() {
      let info = document.querySelector(".info");
      let a = info.querySelector("a");
      if (this.stat) {
        a.innerHTML = ">";
        a.style = "background-color:#363636;transition: left 0.3s";
        info.style = "left:-400px;transition: left 0.3s";
        this.stat = false;
      } else {
        a.innerHTML = "<";
        a.style = "left:400px;background-color: rgba(54, 54, 54, 0.5)";
        info.style = "left:0px;transition: left 0.3s";
        this.stat = true;
      }
    },
    Init() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2RjODQxYy0xNDI0LTRmNmYtOTJjNy02Njk3NGFmNGZlMzMiLCJpZCI6ODg1MTgsImlhdCI6MTY0OTI1MzIzNn0._0nz9pC6RF2dXjkzTilweCdZOP6jE-9Efc1QqjMOR_Q";

      const clock = new Cesium.Clock({
        startTime: Cesium.JulianDate.fromIso8601("2012-08-04T16:00:00Z"), //开始时间
        currentTime: Cesium.JulianDate.fromIso8601("2012-08-04T16:00:00Z"), //当前时间
        stopTime: Cesium.JulianDate.fromIso8601("2012-08-04T16:06:50Z"), //结束时间
        clockRange: 2, //时钟范围 //CLAMPED-到达时不会前进  /UNBOUNDED-始终沿前方前进 /LOOP_STOP-到达结束时间时到间隔的另一端，当时间倒流时不会前进过去开始时间
        // clockStep: Cesium.ClockStep.TICK_DEPENDENT,//时钟步长
        multiplier: 0.5, //倍增器
        // shouldAnimate: true,
      });

      this.viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: Cesium.createWorldTerrain(),
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        infobox: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        // globe: false,
        clockViewModel: new Cesium.ClockViewModel(clock),
      });

      this.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
      this.viewer.imageryLayers.removeAll();
      const imageryLayers = this.viewer.scene.imageryLayers;
      // this.viewer.scene.globe.baseColor = Cesium.Color.Black;
      var imagelayer = new Cesium.SingleTileImageryProvider({
        url: this.imageUrl,
      });
      this.requireJsonData("/case/cities.json");
      this.requireJsonData("/case/province.json");
      this.requireJsonData("/case/border.json");
      imageryLayers.addImageryProvider(imagelayer, this.layercount);
      this.layercount++;

      var handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      let that = this;
      handler.setInputAction(function (movement) {
        //获取鼠标位置，camera.pickEllipsoid()返回一个cartesian类型位置
        let click_position = that.viewer.scene.camera.pickEllipsoid(
          movement.endPosition
        );
        //位置数据转换只地理数据类型
        if (click_position) {
          let radiansPos = Cesium.Cartographic.fromCartesian(click_position);
          let longitude_x = Cesium.Math.toDegrees(radiansPos.longitude).toFixed(
            2
          );
          let longitude_y = Cesium.Math.toDegrees(radiansPos.latitude).toFixed(
            2
          );
          //topDiv是html中的div
          that.lon = longitude_x;
          that.lat = longitude_y;
        }

        //cesium函数转换至地理数据类型的经纬度
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE); //ScreenSpaceEventType
    },
    InitTimelist() {
      for (var i = 0; i < 83; i++) {
        let a = {
          tm: "2D",
          label: "2D视图",
        };
        a.tm = i * 5;
        a.label = i * 5 + "Ma";
        this.timelist.push(a);
      }
    },

    changetime() {
      if (this.mode == "2D") {
        this.viewer.dataSources.removeAll();
        this.requireJsonData("/case/all_pm.json");
        this.requirePngData();
      } else {
        this.viewer.dataSources.removeAll();
        this.requireJsonData("/case/cities.json");
        this.requireJsonData("/case/province.json");
        this.requireJsonData("/case/border.json");
        this.requirePngData();
        console.log(123123123123);
      }

      // console.log(this.time);
    },
    addgrid() {
      var a = new Cesium.GridImageryProvider({
        cells: 3,
        layers: "grid",
        glowWidth: 0,
        backgroundColor: new Cesium.Color(0, 0, 0, 0),
        glowColor: new Cesium.Color(0, 0, 0, 0),
        color: Cesium.Color(0, 0, 0, 0.5),
      });
      // 控制gridlayer一定在最顶层
      this.viewer.scene.imageryLayers.addImageryProvider(a, this.layercount);
      this.layercount++;
      // console.log(JSON.parse(JSON.stringify(this.graticuleLayer)));
    },
    removegrid() {
      this.viewer.scene.imageryLayers.remove(
        this.viewer.scene.imageryLayers._layers[this.layercount - 1]
      );
      this.layercount--;
    },
    changegrid(i) {
      if (i) {
        this.removegrid();
        this.gridIsshown = false;
        this.grid = "打开格网";
      } else {
        this.addgrid();
        this.gridIsshown = true;
        this.grid = "关闭格网";
      }
    },
    requiredata() {
      let that = this;
      if ((this.time < 410) & (this.time > 0)) {
        const data = axios({
          method: "GET",
          url: this.dataServer + "/store/platecase_img/raster_Topography_" + this.time + ".00Ma.png",
          responseType: "arraybuffer",
        })
          .then((response) => {
            //解析响应对象
            // console.log(response);
            this.imageUrl =
              "data:image/png;base64," +
              btoa(
                new Uint8Array(response.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                )
              );
          })
          .catch((error) => {
            console.log(error);
          });
        // const { data: jsondata } = await axios.get(
        //   "/case/reconstruct_json/Export_Output_reconstructed_" +
        //     this.time +
        //     ".00Ma.json"
        // );
        // this.viewer.dataSources.add(
        //   Cesium.GeoJsonDataSource.load(jsondata, {
        //     stroke: Cesium.Color.HOTPINK,
        //     fill: Cesium.Color.RED,
        //     strokeWidth: 3,
        //     markerSymbol: "?",
        //   })
        // );
        // if (this.viewer.dataSources.length == 2) {
        //   this.viewer.dataSources.remove(
        //     this.viewer.dataSources._dataSources[0]
        //   );
        // }
        const imageryLayers = this.viewer.scene.imageryLayers;
        var imagelayer = new Cesium.SingleTileImageryProvider({
          url: this.imageUrl,
        });
        if (this.gridIsshown) {
          imageryLayers.addImageryProvider(imagelayer, this.layercount - 1);
          this.layercount++;
          if (this.layercount >= 4) {
            imageryLayers.remove(imageryLayers._layers[0]);
            this.layercount--;
          }
        } else {
          imageryLayers.addImageryProvider(imagelayer, this.layercount);
          this.layercount++;
          if (this.layercount >= 3) {
            imageryLayers.remove(imageryLayers._layers[0]);
            this.layercount--;
          }
        }
      } else {
        const data = axios({
          method: "GET",
          url: this.dataServer + "/store/platecase_img/raster_Topography_" + this.time + ".00Ma.png",
          responseType: "arraybuffer",
        })
          .then((response) => {
            //解析响应对象
            this.imageUrl =
              "data:image/png;base64," +
              btoa(
                new Uint8Array(response.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                )
              );
          })
          .catch((error) => {
            console.log(error);
          });
        // if(this.mode)
        // this.viewer.dataSources.removeAll();
        // this.requireJsonData("/case/all.json");
        const imageryLayers = this.viewer.scene.imageryLayers;
        imagelayer = new Cesium.SingleTileImageryProvider({
          url: this.imageUrl,
        });
        // 若格网处于打开状态，始终保持格网处于第一层
        if (this.gridIsshown) {
          imageryLayers.addImageryProvider(imagelayer, this.layercount - 1);
          this.layercount++;
        }
        // 格网不处于打开状态，直接添加
        else {
          imageryLayers.addImageryProvider(imagelayer, this.layercount);
          this.layercount++;
        }
      }
    },
    play() {
      // console.log(this.viewer.clock.clockRange);
      // console.log(this.viewer.dataSources._dataSources[0].entities.values[0]);
      // const entity = this.viewer.dataSources._dataSources[0].entities.values[0];
      // this.viewer.trackedEntity = entity;
      let that = this;
      that.timer2 = setTimeout(function () {
        that.viewer.clock.shouldAnimate = true;
      }, 5000);
      this.isplaying = false;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.requiredata();
        this.time--;
        if (this.time == 0) {
          this.requirePngData();
          clearInterval(this.timer);
          console.log(this.viewer.imageryLayers);
          this.isplaying = false;
        }
      }, 2000);
    },
    stop() {
      this.viewer.clock.shouldAnimate = false;
      this.isplaying = true;
      clearInterval(this.timer);
    },
    reset() {
      this.time = 410;
      this.changetime();
    },
    changeview() {
      //根据选择切换场景视图模式
      if (this.value == "3D") {
        //切换场景模式为三维球面
        this.mode = "3D";
        this.viewer.scene.morphTo3D(2);
        this.viewer.dataSources.removeAll();
        this.requireJsonData("/case/cities.json");
        this.requireJsonData("/case/province.json");
        this.requireJsonData("/case/border.json");
      } else if (this.value === "ColumBus") {
        //切换场景模式为三维平面
        this.viewer.scene.morphToColumbusView(2);
        this.mode = "ColumBus";
        this.viewer.dataSources.removeAll();
        this.requireJsonData("/case/cities.json");
        this.requireJsonData("/case/province.json");
        this.requireJsonData("/case/border.json");
      } else if (this.value === "2D") {
        //切换场景模式为二维地图
        this.mode = "2D";
        this.viewer.scene.morphTo2D(2);
        this.viewer.dataSources.removeAll();
        this.requireJsonData("/case/cities.json");
        this.requireJsonData("/case/border.json");
        this.requireJsonData("/case/province_pm.json");
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 兼容css
@import "../../../node_modules/cesium/Source/Widgets/widgets.css";
#cesiumContainer {
  width: 100%;
  height: 103%;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  position: relative;
  // color: rgb(51, 53, 51);
}
.timebar {
  font-size: 50px;
  position: absolute;
  color: #fff;
  left: 40px;
  top: 30px;
  z-index: 9999;
}
.btnBox {
  position: absolute;
  display: flex;
  right: 50px;
  top: 30px;
  z-index: 1000;
  width: 750px;
  align-content: space-between;
}
/deep/.el-input__inner {
  background-color: #363636;
  color: #fff;
}
/deep/ .el-input__wrapper {
  background-color: #363636;
  border: 1px solid #363636;
  margin-left: 20px;
}
// 设置下拉框的背景颜色及边框属性；
/deep/.el-select-dropdown {
  // 若不将下拉框的背景颜色设置为：transparent，那么做不出来半透明的效果；
  // 因为其最终的显示为：下拉框有一个背景颜色且下拉框的字体有一个背景颜色，重叠后的效果展示；
  background-color: transparent;
  border: 1px solid blue;
}
/deep/.location {
  position: absolute;
  bottom: 5px;
  font-size: 20px;
  color: #fff;
  z-index: 99999;
}
.info {
  position: absolute;
  z-index: 99999;
  left: 0;
  top: 40%;
}
.info a {
  display: block;
  text-decoration: none;
  position: absolute;
  height: 60px;
  width: 30px;
  border-radius: 3px;
  line-height: 60px;
  background-color: rgba(54, 54, 54, 0.5);
  color: #fff;
  font-size: 50px;
  left: 400px;
  transition: left 0.3s;
}
.infobox {
  /* height: 228px; */
  height: 500px;
  padding: 8px;
  width: 400px;
  background-color: rgba(54, 54, 54, 0.5);
  // opacity: 50%;
  position: absolute;
  z-index: 99999;
  top: -200px;
  left: 0px;
  transition: left 0.3s;
  color: #fff;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 18px;
  overflow-y: auto;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  /* border-top: 1px solid rgb(224,224,224);
    box-shadow: 0 5px 5px rgba(0, 0, 0, .2); */
}

.info:hover .infobox {
  left: 0px;
}
.info:hover span {
  left: 400px;
}
.el-button /deep/ i {
  font-size: 25px;
}
.el-button /deep/ {
  font-size: 17px;
}

// // 设置下拉框的字体属性及背景颜色；
// .el-select-dropdown__item {
//   line-height: 30px;
//   text-align: center;
//   color: rgb(211, 208, 208);
//   background-color: #363636;
//   margin: 0;
// }

// // 设置鼠标悬停在下拉框列表的悬停色；
// .el-select-dropdown__item:hover {
//   background-color: rgba(49, 44, 44, 0.5);
// }
// /deep/.el-select-dropdown__wrap {
//   background-color: #363636 !important;
// }
// /deep/.el-scrollbar {
//   background-color: #363636 !important;
// }
// /deep/.el-select-dropdown__list {
//   padding: 0;
// }

// // 将下拉框上的小箭头取消；(看着像一个箭头，其实是两个重叠在一起的箭头)
// /deep/.el-popper .popper__arrow,
// /deep/.el-popper .popper__arrow::before {
//   background-color: #363636;
// }
// .el-select-dropdown {
//   background-color: #363636;
// }
// /deep/.el-popper {
//   background-color: #363636;
//   border: 0px;
// }
// // :popper-append-to-body="false"
</style>

