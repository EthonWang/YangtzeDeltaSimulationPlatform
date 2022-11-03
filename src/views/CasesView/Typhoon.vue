<template>
  <div class="dataTable">
    <el-card>
      <el-select
        v-model="year_val"
        class="m-2"
        placeholder="选择年份"
        @change="changeYear($event)"
      >
        <el-option
          v-for="item in yearGroup"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="name_val"
        class="m-2"
        placeholder="选择台风"
        @change="changeName($event)"
      >
        <el-option
          v-for="item in nameData"
          :key="item"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <!-- <el-button type="primary">查询</el-button> -->
      <!-- <el-button
        style="margin: 5px"
        v-for="(item, index) in nameData"
        :key="item"
        @click="clickName(item.name, index)"
        class="btntf"
        >{{ item.name }}</el-button
      > -->
    </el-card>
    <!-- <el-button
      :icon="arrowIcon"
      class="collapse-button"
      @click="handleCollapse"
    >
      台风烟花路径信息
    </el-button> -->
    <el-table
      :data="tableData"
      id="dataTableId"
      style="border-radius: 6px; height: calc(100vh - 194px); overflow: scroll"
      stripe
    >
      <el-table-column prop="time" label="时间" width="150" />
      <el-table-column prop="speed" label="风速" />
      <el-table-column prop="strong" label="时间偏移" width="100" />
      <el-table-column prop="pressure" label="位置" />
    </el-table>
  </div>
  <el-card
    style="position: absolute; z-index: 10; width: 300px; height: 320px"
    class="pane_data"
    v-show="paneData.name != ''"
  >
    <template #header>
      <div class="card-header">
        <strong>台风点数据</strong>
      </div>
      <div style="position: absolute; right: 10px; top: 18px; opacity: 0.8">
        （点击可预测未来路径）
      </div>
      <!-- <el-radio-group
        v-model="radio1"
        :on-change="changeWind()"
        style="position: absolute; right: 5px; top: 10px"
      >
        <el-radio :label="7" border>7级</el-radio>
        <el-radio :label="10" border>10级</el-radio>
        <el-radio :label="12" border>12级</el-radio>
      </el-radio-group> -->
    </template>
    <el-row>
      <el-col :span="12">名字</el-col>
      <el-col :span="12">{{ paneData.name }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">坐标</el-col>
      <el-col :span="12">{{ paneData.coordinates }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">基准时间</el-col>
      <el-col :span="12">{{ paneData.time }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">预测时间</el-col>
      <el-col :span="12">{{ paneData.Validtime + " hour later" }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">7级风</el-col>
      <el-col :span="12">{{ paneData.seven }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">10级风</el-col>
      <el-col :span="12">{{ paneData.ten }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">12级风</el-col>
      <el-col :span="12">{{ paneData.eleven }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">东面覆盖范围</el-col>
      <el-col :span="12">{{
        String(paneData.east == 999998 ? 0 : paneData.east) + " km"
      }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">南面覆盖范围</el-col>
      <el-col :span="12">{{
        String(paneData.south == 999998 ? 0 : paneData.south) + " km"
      }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">西面覆盖范围</el-col>
      <el-col :span="12">{{
        String(paneData.west == 999998 ? 0 : paneData.west) + " km"
      }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">北面覆盖范围</el-col>
      <el-col :span="12">{{
        String(paneData.north == 999998 ? 0 : paneData.north) + " km"
      }}</el-col>
    </el-row>
  </el-card>
  <div id="map" style="position: absolute; width: 100%; height: 100%"></div>
</template>

<script setup>
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons-vue";
import typhoonLogo1 from "@/assets/img/typhoonLogo/1.jpg";
import typhoonLogo2 from "@/assets/img/typhoonLogo/2.jpg";
import typhoonLogo3 from "@/assets/img/typhoonLogo/3.jpg";
import typhoonLogo4 from "@/assets/img/typhoonLogo/4.jpg";
import typhoonLogo5 from "@/assets/img/typhoonLogo/5.jpg";
import typhoonLogo6 from "@/assets/img/typhoonLogo/6.jpg";
import Map from "ol/Map";
import View from "ol/View";
import PointerInteraction from "ol/interaction/Pointer";
import * as Control from "ol/control";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import Overlay from "ol/Overlay";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import * as olProj from "ol/proj";
import { getLength } from "ol/sphere";
import { getBottomLeft, getTopRight, containsCoordinate } from "ol/extent";
import olstyle from "ol/style/Style";
import olstroke from "ol/style/Stroke";
import olicon from "ol/style/Icon";
import olcircle from "ol/style/Circle";
import ofill from "ol/style/Fill";
import oltext from "ol/style/Text";
import olLineString from "ol/geom/LineString";
import olPoint from "ol/geom/Point";
import ollayervetor from "ol/layer/Vector";
import olsourcevector from "ol/source/Vector";
import * as ol from "ol";
import * as format from "ol/format";
import * as layer from "ol/layer";
import * as source from "ol/source";
import * as style from "ol/style";
import "ol/ol.css";
import { XYZ, TileImage } from "ol/source";
import { onMounted, ref } from "vue";
import { YangtzeVGLab } from "../../../public/backURL/backurl";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const radio1 = ref(7);
const yearGroup = ref([]);
const year_val = ref("");
const name_val = ref("");
const changeName = (value) => {
  clickName(name_val.value);
};
const changeYear = (value) => {
  fetch(
    dataServer + "/store/data/typhoon/TYPHOON_Name" + year_val.value + ".json"
  )
    .then((res) => {
      return res.json();
    })
    .then((overview) => {
      let points = overview;
      points.map((item) => {
        nameData.value.push({
          name: item.name,
          speed: 1,
          strong: 1,
          pressure: 1,
        });
      });
    });
  fetch(
    dataServer + "/store/data/typhoon/TYPHOON_OBS" + year_val.value + ".json"
  )
    .then((res) => {
      return res.json();
    })
    .then((overview) => {
      let points = overview.data;
      points.map((item) => {
        allData.push(item);
      });
    });
};

let lastClick = 0;
let config = {
  x: 122.91345321106421, //台风圈中心点经度
  y: 30.324543879896564, //台风圈中心点维度
  r: {
    SE: 0.5,
    NE: 0.3,
    NW: 0.2,
    SW: 0.5,
  },
  interval: 6, // 6° 一个间隔；间隔越小，台风圈越平滑
};
let paneData = ref({
  name: "",
  coordinates: "",
  time: "",
  Validtime: "",
  east: 0,
  south: 0,
  west: 0,
  north: 0,
  seven: "",
  ten: "",
  eleven: "",
});
const emptyPane = () => {
  paneData.value.name = "";
};
//折叠按钮
const tableHeight = ref(450);
const arrowIcon = ref(ArrowUpBold);
const handleCollapse = () => {
  if (tableHeight.value == 450) {
    tableHeight.value = 0;
    arrowIcon.value = ArrowDownBold;
  } else {
    tableHeight.value = 450;
    arrowIcon.value = ArrowUpBold;
  }
};

//台风路径数据表
const tableData = ref([]);
const nameData = ref([]);
const allData = [];
let validData = [];
const nowdata = ref(null);
const dataServer = useStore().getters.devIpAddress;

let map;
let validMod = false;
let radiusLayers = [];

const changeWind = () => {
  console.log("1");
};

const init = () => {
  let elem = document.getElementById("map");
  let url =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  map = new Map({
    target: elem,
    layers: [new TileLayer({ source: new XYZ({ url }) })],
    view: new View({
      center: [122, 30.13],
      zoom: 6,
      projection: "EPSG:4326",
    }),
    controls: Control.defaults().extend([
      new Control.MousePosition(), // 实例化坐标拾取控件，并加入地图
    ]),
  });
  map.on();
  draw2448();
  featureClick((flag, value) => {
    if (flag == false) {
      // paneData.value.name = "";
      // if (radiusLayer != null) {
      //   map.removeLayer(radiusLayer);
      //   radiusLayer = null;
      // }
      return;
    }
    if (value.type == "node") {
      if (validTrace != null && value.info.Validtime == "0") {
        validTrace.stop();
        validTrace.clear();
        validTrace = null;
      }
      if (radiusLayers != []) {
        let radiusLayer = radiusLayers.pop();
        while (radiusLayer) {
          map.removeLayer(radiusLayer);
          radiusLayer = radiusLayers.pop();
        }
      }

      let NE = Number(value.info["Radiu_Bear1_WING_A7"]) / 112;
      let SE = Number(value.info["Radiu_Bear2_WING_A7"]) / 112;
      let SW = Number(value.info["Radiu_Bear3_WING_A7"]) / 112;
      let NW = Number(value.info["Radiu_Bear4_WING_A7"]) / 112;
      let NE10 = Number(value.info["Radiu_Bear1_WING_A10"]) / 112;
      let SE10 = Number(value.info["Radiu_Bear2_WING_A10"]) / 112;
      let SW10 = Number(value.info["Radiu_Bear3_WING_A10"]) / 112;
      let NW10 = Number(value.info["Radiu_Bear4_WING_A10"]) / 112;
      let NE12 = Number(value.info["Radiu_Bear1_WING_A12"]) / 112;
      let SE12 = Number(value.info["Radiu_Bear2_WING_A12"]) / 112;
      let SW12 = Number(value.info["Radiu_Bear3_WING_A12"]) / 112;
      let NW12 = Number(value.info["Radiu_Bear4_WING_A12"]) / 112;
      if (NE >= 1999.98) {
        NE = 0;
      }
      if (SE >= 1999.98) {
        SE = 0;
      }
      if (SW >= 1999.98) {
        SW = 0;
      }
      if (NW >= 1999.98) {
        NW = 0;
      }
      if (NE10 >= 1999.98) {
        NE10 = 0;
      }
      if (SE10 >= 1999.98) {
        SE10 = 0;
      }
      if (SW10 >= 1999.98) {
        SW10 = 0;
      }
      if (NW10 >= 1999.98) {
        NW10 = 0;
      }
      if (NE12 >= 1999.98) {
        NE12 = 0;
      }
      if (SE12 >= 1999.98) {
        SE12 = 0;
      }
      if (SW12 >= 1999.98) {
        SW12 = 0;
      }
      if (NW12 >= 1999.98) {
        NW12 = 0;
      }

      if (value.info.Validtime == 0) {
        drawRadius({
          x: Number(value.info.Lon),
          y: Number(value.info.Lat),
          r: { SE: SE, NE: NE, NW: NW, SW: SW },
          interval: 6,
        });
        setTimeout(() => {
          drawRadius({
            x: Number(value.info.Lon),
            y: Number(value.info.Lat),
            r: { SE: SE10, NE: NE10, NW: NW10, SW: SW10 },
            interval: 6,
          });
        }, 100);
        setTimeout(() => {
          drawRadius({
            x: Number(value.info.Lon),
            y: Number(value.info.Lat),
            r: { SE: SE12, NE: NE12, NW: NW12, SW: SW12 },
            interval: 6,
          });
        }, 200);
        setTimeout(() => {
          if (validTrace) {
            map.removeLayer(validTrace);
          }
          validData = [];

          validData = allData.filter(
            (item) =>
              item.TYPH_Name == value.info.TYPH_Name &&
              item.Datetime == value.info.Datetime
          );
          validData.sort((a, b) => a.Validtime - b.Validtime);
          while (tableData.value.length > 0) {
            //不能直接table.value=[],会触发VUE响应式机制联动清掉毫不相关的台风范围，很不合常理。
            tableData.value.pop();
          }

          validData.map((item) => {
            if (item.MoSpeed_Futrue == 999998) {
              item.MoSpeed_Futrue = 0;
            }
            tableData.value.push({
              time:
                item.Year +
                "/" +
                item.Mon +
                "/" +
                item.Day +
                " " +
                item.Hour +
                ":00",
              speed: item.MoSpeed_Futrue.toFixed(2) + " m/s",
              strong: item.Validtime + " h",
              pressure: item.Lon + " , " + item.Lat,
            });
          });
          let lineArr = [];
          let attr = [];
          let times = [];
          let info = [];
          let points = validData;
          for (let i = 0; i < points.length; i++) {
            let lat = parseFloat(points[i].Lat);
            let lng = parseFloat(points[i].Lon);
            let strong = "";

            times.push(
              points[i].Year +
                "/" +
                points[i].Mon +
                "/" +
                points[i].Day +
                " " +
                points[i].Hour +
                ":00:00"
            );
            lineArr.push([lng, lat]);
            attr.push(strong);
            info.push(points[i]);
          }

          validMod = true;
          let p = new lu_LocusOption({
            locusData: {
              locusId: 1, // 路径点id
              nodeIcon:
                "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png", //路径点图标
              label: new Object({
                // 加入label对象
                offset: [15, 0], // 修改label相对于maker的位置 偏移
                content: "", //显示内容，也可以为html
              }),
              lnglat: lineArr, //路径点数组
              nodetype: attr,
              times: times,
              info: info,
            },
            locusState: {
              circlable: false, // 是否循环播放，false只做一次
            },
          });

          validTrace = new TraceLib(map, p, "#ff0000");
          validTrace.start();
        }, 300);
      }
    }
  });

  featureHover((flag, value) => {
    if (flag == false) {
      paneData.value.name = "";
      map.getTargetElement().style.cursor = '';
      return;
    }
    if (value.type == "node") {
      map.getTargetElement().style.cursor = 'pointer';
      let event = window.event;
      document.getElementsByClassName("pane_data")[0].style.top =
        event.pageY - 60 + "px";
      document.getElementsByClassName("pane_data")[0].style.left =
        event.pageX + 5 + "px";
      paneData.value.east =
        value.info["Radiu_Bear1_WING_A" + String(radio1.value)];
      paneData.value.south =
        value.info["Radiu_Bear2_WING_A" + String(radio1.value)];
      paneData.value.west =
        value.info["Radiu_Bear3_WING_A" + String(radio1.value)];
      paneData.value.north =
        value.info["Radiu_Bear4_WING_A" + String(radio1.value)];
      let NE = Number(value.info["Radiu_Bear1_WING_A7"]) / 112;
      let SE = Number(value.info["Radiu_Bear2_WING_A7"]) / 112;
      let SW = Number(value.info["Radiu_Bear3_WING_A7"]) / 112;
      let NW = Number(value.info["Radiu_Bear4_WING_A7"]) / 112;
      let NE10 = Number(value.info["Radiu_Bear1_WING_A10"]) / 112;
      let SE10 = Number(value.info["Radiu_Bear2_WING_A10"]) / 112;
      let SW10 = Number(value.info["Radiu_Bear3_WING_A10"]) / 112;
      let NW10 = Number(value.info["Radiu_Bear4_WING_A10"]) / 112;
      let NE12 = Number(value.info["Radiu_Bear1_WING_A12"]) / 112;
      let SE12 = Number(value.info["Radiu_Bear2_WING_A12"]) / 112;
      let SW12 = Number(value.info["Radiu_Bear3_WING_A12"]) / 112;
      let NW12 = Number(value.info["Radiu_Bear4_WING_A12"]) / 112;
      if (NE >= 1999.98) {
        NE = 0;
      }
      if (SE >= 1999.98) {
        SE = 0;
      }
      if (SW >= 1999.98) {
        SW = 0;
      }
      if (NW >= 1999.98) {
        NW = 0;
      }
      if (NE10 >= 1999.98) {
        NE10 = 0;
      }
      if (SE10 >= 1999.98) {
        SE10 = 0;
      }
      if (SW10 >= 1999.98) {
        SW10 = 0;
      }
      if (NW10 >= 1999.98) {
        NW10 = 0;
      }
      if (NE12 >= 1999.98) {
        NE12 = 0;
      }
      if (SE12 >= 1999.98) {
        SE12 = 0;
      }
      if (SW12 >= 1999.98) {
        SW12 = 0;
      }
      if (NW12 >= 1999.98) {
        NW12 = 0;
      }
      if (NE == 0 && SE == 0 && SW == 0 && NW == 0) {
        paneData.value.seven = "无";
      } else {
        paneData.value.seven = "有";
      }
      if (NE10 == 0 && SE10 == 0 && SW10 == 0 && NW10 == 0) {
        paneData.value.ten = "无";
      } else {
        paneData.value.ten = "有";
      }
      if (NE12 == 0 && SE12 == 0 && SW12 == 0 && NW12 == 0) {
        paneData.value.eleven = "无";
      } else {
        paneData.value.eleven = "有";
      }
      paneData.value.time =
        value.info.Year +
        "/" +
        value.info.Mon +
        "/" +
        value.info.Day +
        " " +
        value.info.Hour +
        ":00:00";
      paneData.value.Validtime = value.info.Validtime;
      paneData.value.name = value.info.TYPH_Name;
      paneData.value.coordinates = value.info.Lon + " , " + value.info.Lat;
    }
  });
};
let typhoonPath = null;
let trace = null;
let validTrace = null;
const loadTyphoonTrace = () => {
  if (typhoonPath == null) {
    fetch(dataServer + "/store/data/typhoon/HaveYear.json")
      .then((res) => {
        return res.json();
      })
      .then((overview) => {
        overview.years.map((item) => {
          yearGroup.value.push(item);
        });
      });
  }
};
const featureClick = (callback) => {
  let selectPointerClick = new PointerInteraction({
    handleDownEvent: function (ev) {
      let pixel = ev.pixel;
      let feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      if (feature) {
        callback(true, feature.values_); // do something
      } else {
        callback(false); //do something
      }
    },
  });
  map.addInteraction(selectPointerClick);
};
/**
 * 捕捉滑过事件
 */
const featureHover = (callback) => {
  map.on("pointermove", function (ev) {
    let pixel = ev.pixel;
    let feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature;
    });
    if (feature) {
      callback(true, feature.values_); //geometry.flatCoordinates,type,info
    } else {
      callback(false); // do something
    }
  });
};

const clickName = (name, index = 0, validTime = "0") => {
  validMod = false;
  if (radiusLayers != []) {
    let radiusLayer = radiusLayers.pop();
    while (radiusLayer) {
      map.removeLayer(radiusLayer);
      radiusLayer = radiusLayers.pop();
    }
  }

  // document.getElementsByClassName("btntf")[index].style.background =
  //   "rgba(0,155,255,0.3)";
  // document.getElementsByClassName("btntf")[lastClick].style.background =
  //   "rgba(0,155,255,0)";
  // lastClick = index;
  if (trace) {
    trace.stop();
    trace.clear();
  }
  if (validTrace != null) {
    validTrace.stop();
    validTrace.clear();
    validTrace = null;
  }
  let nowData = allData.filter(
    (item) => item.TYPH_Name == name && item.Validtime == 0
  );
  nowData = nowData.sort((a, b) => a.Datetime - b.Datetime);
  tableData.value = [];
  nowData.map((item) => {
    tableData.value.push({
      time:
        item.Year + "/" + item.Mon + "/" + item.Day + " " + item.Hour + ":00",
      speed: item.MoSpeed_Futrue.toFixed(2) + " m/s",
      strong: item.Validtime + " h",
      pressure: item.Lon + " , " + item.Lat,
    });
  });

  let points = nowData;
  typhoonPath = points;
  map.getView().setCenter([points[0].Lon, points[0].Lat]);
  map.getView().setZoom(6);
  // (new View({
  //     center: [points[0].Lon, points[0].Lat],
  //     zoom: 6,
  //     projection: "EPSG:4326",
  //   }))
  // map.zoomOut()
  let lineArr = [];
  let attr = [];
  let times = [];
  let info = [];
  if (points.length <= 0) {
    alert("数据缺失!!!");
    return;
  }

  for (let i = 0; i < points.length; i++) {
    let lat = parseFloat(points[i].Lat);
    let lng = parseFloat(points[i].Lon);
    let strong = "";

    times.push(
      points[i].Year +
        "/" +
        points[i].Mon +
        "/" +
        points[i].Day +
        " " +
        points[i].Hour +
        ":00:00"
    );
    lineArr.push([lng, lat]);
    attr.push(strong);
    info.push(points[i]);
  }
  let p = new lu_LocusOption({
    locusData: {
      locusId: 1, // 路径点id
      nodeIcon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png", //路径点图标
      label: new Object({
        // 加入label对象
        offset: [15, 0], // 修改label相对于maker的位置 偏移
        content: "", //显示内容，也可以为html
      }),
      lnglat: lineArr, //路径点数组
      nodetype: attr,
      times: times,
      info: info,
    },
    locusState: {
      circlable: false, // 是否循环播放，false只做一次
    },
  });
  trace = new TraceLib(map, p);
  trace.start();
};

//台风范围
const drawRadius = (config) => {
  let wktformat = new format.WKT();
  let features = [];
  let wkt = `POLYGON((`;
  let wkt0 = "";
  for (let i = 0; i < 360 / config.interval; i++) {
    let r = 0;
    let ang = i * config.interval;
    //第一象限
    if (ang > 45 && ang <= 135) {
      r = config.r.NW;
    }
    //第二象限
    else if (ang > 135 && ang <= 225) {
      r = config.r.SW;
    }
    // 第三象限
    else if (ang > 225 && ang <= 315) {
      r = config.r.SE;
    }
    // 第四象限
    else {
      r = config.r.NE;
    }
    let x = config.x + r * Math.cos((ang * Math.PI) / 180);
    let y = config.y + r * Math.sin((ang * Math.PI) / 180);
    wkt = wkt + `${x} ${y},`;
    if (i === 0) {
      wkt0 = `${x} ${y}`;
    }
  }
  wkt = wkt + wkt0 + "))";
  features.push(wktformat.readFeature(wkt));
  features.push(
    wktformat.readFeature("POINT(" + config.x + " " + config.y + ")")
  );

  let styleFunc = function (feature, resolution) {
    return new style.Style({
      fill: new style.Fill({
        color: "rgba(255, 0, 0, 0.2)",
      }),
      stroke: new style.Stroke({
        color: "#ffcc33",
        width: 2,
      }),
      image: new style.Circle({
        radius: 10,
        fill: new style.Fill({
          color: "#ff0000",
        }),
      }),
    });
  };

  let vector1 = new layer.Vector({
    source: new source.Vector({
      features: features,
    }),
    style: styleFunc,
  });

  setTimeout(() => {
    map.addLayer(vector1);
    radiusLayers.push(vector1);
  }, 100);
};
let draw24 = false;
let draw48 = false;
const draw2448 = () => {
  let earlyWarnLine = [
    {
      key: 24,
      name: "小时警戒线",
      color: "red",
      list: [
        [105, 0],
        [113, 4.5],
        [119, 11],
        [119, 18],
        [127, 22],
        [127, 34],
      ],
    },
    {
      key: 48,
      name: "小时警戒线",
      color: "yellow",
      list: [
        [105, 0],
        [120, 0],
        [132, 15],
        [132, 34],
      ],
    },
  ];

  let featureLine = new Feature({
    geometry: new olLineString([
      [105, 0],
      [113, 4.5],
      [119, 11],
      [119, 18],
      [127, 22],
      [127, 34],
    ]),
  });
  let featureLine1 = new Feature({
    geometry: new olLineString([
      [105, 0],
      [120, 0],
      [132, 15],
      [132, 34],
    ]),
  });
  featureLine.setStyle(
    new olstyle({
      stroke: new olstroke({
        width: 2,
        color: "rgb(255,55,25)",
        lineDash: [2, 4, 2, 4],
      }),
      text: new oltext({
        font: "normal 20px 黑体",
        // // 对其方式
        textAlign: "center",
        // 基准线
        textBaseline: "middle",
        offsetY: -35,
        offsetX: 0,
        backgroundFill: new olstroke({
          color: "rgba(155,0,55,0.2)",
        }),
        // 文本填充样式
        fill: new ofill({
          color: "rgba(236,21,20,1)",
        }),
        padding: [5, 5, 5, 5],
        text: "24h警戒",
      }),
    })
  );
  featureLine1.setStyle(
    new olstyle({
      stroke: new olstroke({
        width: 2,
        color: "rgb(255,200,25)",
        lineDash: [2, 4, 2, 4],
      }),
      text: new oltext({
        font: "normal 20px 黑体",
        // // 对其方式
        textAlign: "center",
        // 基准线
        textBaseline: "middle",
        offsetY: -35,
        offsetX: 0,
        backgroundFill: new olstroke({
          color: "rgba(155,55,55,0.2)",
        }),
        // 文本填充样式
        fill: new ofill({
          color: "rgba(236,211,20,1)",
        }),
        padding: [5, 5, 5, 5],
        text: "48h警戒",
      }),
    })
  );
  
  let source = new olsourcevector();
  source.addFeature(featureLine);
  source.addFeature(featureLine1);
  let layer = new VectorLayer();
  layer.setSource(source);

  setTimeout(() => {
    map.addLayer(layer);
    // map.on('pointermove',function(e){
    //     var pixel = map.getEventPixel(e.originalEvent);
    //     var hit = map.hasFeatureAtPixel(pixel);
    //     console.log(e);
    //     if(hit){
    //         map.getTargetElement().style.cursor = 'pointer';
    //     }
    //     else{
    //         map.getTargetElement().style.cursor = '';
    //     }
    // });
  }, 150);
};

/**
 * 轨迹回放
 * @constructor
 */
class lu_LocusOption {
  constructor(data) {
    this.locusData = {
      locusId: null,
      label: null,
      icon: "http://webapi.amap.com/images/car.png",
      lnglat: [],
      lineType: "solid",
      lineWidth: 3,
      nodeIcon: null,
      lineOpacity: 0.6,
      lineColor: "#0000ff",
      nodetype: "",
      times: [],
      info: [],
    };

    this.locusState = {
      moveSpeed: 30,
      isSetView: false,
      syncEvent: null,
      circlable: false,
      overlayEvent: null,
    };
    if (data) {
      if (data.locusData) {
        if (data.locusData.times) this.locusData.times = data.locusData.times;
        if (data.locusData.locusId)
          this.locusData.locusId = data.locusData.locusId;
        if (data.locusData.icon) this.locusData.icon = data.locusData.icon;
        if (data.locusData.label) this.locusData.label = data.locusData.label;
        if (data.locusData.lnglat)
          this.locusData.lnglat = data.locusData.lnglat;
        if (data.locusData.info) this.locusData.info = data.locusData.info;
        if (data.locusData.lineType)
          this.locusData.lineType = data.locusData.lineType;
        if (data.locusData.nodeIcon)
          this.locusData.nodeIcon = data.locusData.nodeIcon;
        if (data.locusData.lineWidth)
          this.locusData.lineWidth = data.locusData.lineWidth;
        if (data.locusData.lineColor)
          this.locusData.lineColor = data.locusData.locusData.lineColor;
        if (data.locusState) {
          if (data.locusState.moveSpeed)
            this.locusState.moveSpeed = data.locusState.moveSpeed;
          if (data.locusState.isSetView != undefined)
            this.locusState.isSetView = data.locusState.isSetView;
          if (data.locusState.syncEvent)
            this.locusState.syncEvent = data.locusState.syncEvent;
          if (data.locusState.circlable != undefined)
            this.locusState.circlable = data.locusState.circlable;
          if (data.locusState.overlayEvent)
            this.locusState.overlayEvent = data.locusState.overlayEvent;
        }
        if (data.locusData) {
          if (data.locusData.nodetype)
            this.locusData.nodetype = data.locusData.nodetype;
        }
      }
    }
  }
}

class TraceLib {
  constructor(map, LocusOption) {
    this._map = map;
    this._lu_locus = null;
    this.traceFeatures = [];
    this.vectorLayer = null;
    this._init(LocusOption);
  }

  _init(LocusOption) {
    if (this._lu_locus) {
      this._lu_locus.stop();
    }
    try {
      let _locusState = LocusOption.locusState;
      let _locusData = LocusOption.locusData;

      this.lu_DrawLinesAndMarkers(_locusData, _locusState);

      //开启路书
      this._lu_locus = new lu_track(
        this._map,
        _locusData.nodetype,
        _locusData.lnglat,
        _locusData.times,
        {
          defaultContent: _locusData.label,
          autoView: false, //_locusState.isSetView, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
          speed: _locusState.moveSpeed,
          enableRotation: true, //是否设置marker随着道路的走向进行旋转
          circlable: _locusState.circlable,
        }
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  start() {
    if (this._lu_locus) this._lu_locus.start();
  }

  stop() {
    if (this._lu_locus) {
      this._lu_locus.stop();
    }
  }
  clear() {
    if (this.vectorLayer) {
      this._map.removeLayer(this.vectorLayer);
      //清空
    }
  }
  pause() {
    if (this._lu_locus) this._lu_locus.pause();
  }

  lu_DrawLinesAndMarkers(locusData, _locusState) {
    if (locusData) {
      if (locusData.nodeIcon) {
        this.image = locusData.nodeIcon;
      }
      if (locusData.label) this.text = locusData.label.content;
      if (locusData.label) this.offset = locusData.label.offset;
    }

    let nodecolor = "#2977cc";
    if (validMod) {
      nodecolor = "hsl(150,100%,50%)";
    }
    //根据节点强度值不同设置不同的点颜色和线颜色
    let styles = {
      route: new olstyle({
        stroke: new olstyle({
          width: 2,
          color: [237, 212, 0, 0.8],
        }),
      }),
      node: new olstyle({
        image: new olcircle({
          radius: 6,
          stroke: new olstroke({
            color: "#efeeee",
            width: 0,
          }),
          fill: new ofill({
            color: nodecolor,
          }),
        }),
      }),
      icon1: new olstyle({
        image: new olicon({
          anchor: [0.5, 1],
          src: this.image,
        }),
        text: new oltext({
          font: "13px Microsoft Yahei",
          text: "起点",
          fill: new ofill({
            color: "#aa3300",
          }),
          stroke: new olstroke({ color: "#fff", width: 2 }),
          textAlign: "left",
        }),
      }),
      icon2: new olstyle({
        image: new olicon({
          anchor: [0.5, 1],
          src: this.image,
        }),
        text: new oltext({
          font: "13px Microsoft Yahei",
          text: "终点",
          fill: new ofill({
            color: "#aa3300",
          }),
          stroke: new olstroke({ color: "#fff", width: 2 }),
          textAlign: "left",
        }),
      }),
      geoMarker: new olstyle({
        image: new olicon({
          anchor: [0.5, 0.5],
          rotation: 0,
          size: [52, 26],
          src: typhoonLogo1,
        }),
        text: new oltext({
          font: "13px Microsoft Yahei",
          text: this.text,
          fill: new ofill({
            color: "#aa3300",
          }),
          stroke: new olstroke({ color: "#fff", width: 2 }),
          offsetX: this.offset[0],
          offsetY: this.offset[1],
          textAlign: "left",
        }),
      }),
    };

    let locussff = [],
      star,
      stop;
    let color = "#2977cc";
    let width = 4;
    let style;
    if (validMod) {
      //看看是不是预测模式的线
      color = "hsl(150,100%,50%)";
      width = 3;
      style = new olstyle({
        stroke: new olstroke({
          width: width,
          color: color,
          lineDash: [5, 10, 15, 5],
        }),
      });
    } else {
      style = new olstyle({
        stroke: new olstroke({
          width: width,
          color: color,
        }),
      });
    }

    let lineFeature = new Feature(new olLineString(locusData.lnglat));
    lineFeature.setId(locusData.locusId);
    lineFeature.setStyle(style);
    this.traceFeatures.push(lineFeature);
    locussff.push(lineFeature);

    //节点打印
    let arrLngLat = locusData.lnglat;
    // let t_attr = locusData.attr;

    let arrX = [],
      arrY = [];
    for (let i in arrLngLat) {
      if (i > 0 && i < arrLngLat.length - 1) {
        let nodeMarker = new Feature({
          type: "node",
          info: locusData.info[i],
          geometry: new olPoint(locusData.lnglat[i]),
        });
        locussff.push(nodeMarker);
      } else {
        if (i == 0) {
          let starMarker = new Feature({
            type: "node",
            info: locusData.info[i],
            geometry: new olPoint(arrLngLat[i]),
          });
          locussff.push(starMarker);
        } else if (i == arrLngLat.length - 1) {
          let startMarker = new Feature({
            type: "node",
            info: locusData.info[i],
            geometry: new olPoint(arrLngLat[i]),
          });
          locussff.push(startMarker);
        }
      }
      arrX.push(arrLngLat[i][0]);
      arrY.push(arrLngLat[i][1]);
    }

    this.vectorLayer = new ollayervetor({
      zIndex: 1,
      source: new olsourcevector({
        features: locussff,
      }),
      style: function (feature) {
        // hide geoMarker if animation is active
        if (feature.get("type") === "geoMarker") return null;
        else return styles[feature.get("type")];
      },
    });

    this._map.addLayer(this.vectorLayer);

    //标题
    let mp2 = document.createElement("div");
    mp2.id = "mycar_title_" + new GUID().newGUID();
    mp2.innerText = this.text;

    let title_id = "_ty_lj_key_title_" + new GUID().newGUID();
    let title = new Overlay({
      id: title_id,
      //autoPan: true,
      position: [arrX[0][0], arrY[0][1]],
      stopEvent: false,
      offset: this.offset,
      positioning: "bottom-left",
      element: mp2,
    });
    this._map.title_id = title_id;
    this._map.addOverlay(title);
  }
}

class lu_track {
  constructor(map, nodetype, path, times, opts) {
    if (!path || path.length < 1) {
      return;
    }
    this._times = times;
    this.ismove = false;
    this.nodetype = nodetype;
    this._cc = 0;
    this._map = map;
    //存储一条路线
    this._path = path;
    //移动到当前点的索引
    this.i = 0;
    //控制暂停后开始移动的队列的数组
    this._setTimeoutQuene = [];
    //进行坐标转换的类
    // this._projection = this._map.getMapType().getProjection();
    this._opts = {
      icon: null,
      //默认速度 米/秒
      speed: 400,
      defaultContent: "",
    };

    this._setOptions(opts);
    this._rotation = 0; //小车转动的角度

    //如果不是默认实例，则使用默认的icon  instanceof BMap.Icon
    if (!this._opts.icon) {
      this._opts.icon = typhoonLogo1;
    }

    //缓动效果
    this._tween = {
      //初始坐标，目标坐标，当前的步长，总的步长
      linear: function (initPos, targetPos, currentCount, count) {
        let b = initPos,
          c = targetPos - initPos,
          t = currentCount,
          d = count;
        return (c * t) / d + b;
      },
    };
  }

  //根据用户输入的opts，修改默认参数_opts
  _setOptions(opts) {
    if (!opts) {
      return;
    }
    for (let p in opts) {
      // if (opts.hasOwnProperty(p)) {
      //   this._opts[p] = opts[p];
      // }
    }
  }

  //开始运动
  start() {
    this.ismove = true;
    let me = this,
      len = me._path.length;

    //不是第一次点击开始,并且小车还没到达终点
    if (me.i && me.i < len - 1) {
      //没按pause再按start不做处理
      if (!me._fromPause) {
        return;
      } else if (!me._fromStop) {
        //按了pause按钮,并且再按start，直接移动到下一点
        //并且此过程中，没有按stop按钮
        //防止先stop，再pause，然后连续不停的start的异常
        me._moveNext(++me.i);
      }
    } else {
      //第一次点击开始，或者点了stop之后点开始
      let marker = me._addMarker();
      me._marker = marker;
      //等待marker动画完毕再加载infowindow
      me._timeoutFlag = setTimeout(function () {
        //弹出窗口
        //me._addInfoWin();
        if (me._opts.defaultContent == "") {
          //  me.hideInfoWindow();
        }
        me._moveNext(me.i);
      }, 400);
    }
    //重置状态
    this._fromPause = false;
    this._fromStop = false;
  }

  //结束运动
  stop() {
    this.ismove = false;
    this.i = 0;
    this._fromStop = true;
    clearInterval(this._intervalFlag);
    this._clearTimeout();

    if (this._marker) {
      //this._map.getOverlays().clear();

      this._map.removeOverlay(this._marker.TYMarker);

      let overs = this._map.getOverlayById(this._map.title_id);
      if (overs) {
        // this._map.removeOverlay(overs);
        overs.element.innerText = "";
      }
    }
  }

  //暂停运动
  pause() {
    clearInterval(this._intervalFlag);

    //标识是否是按过pause按钮
    this._fromPause = true;
    this._clearTimeout();
  }

  //添加marker到地图上
  _addMarker(callback) {
    // 如果地图上有之前的台风符号，则移除
    if (this._marker) {
      this.stop();
      //this._marker.setMap(null);
      //
      clearTimeout(this._timeoutFlag);
    }
    //移除之前的overlay
    this._overlay && this._overlay.setMap(null);
    let marker = new TYCar(this._path[0], this._opts);
    this._map.addOverlay(marker.TYMarker);
    marker.times = this._times;
    return marker;

    // let adiv = this._marker.getIcon().containerDiv;
    //adiv.innerHTML = adiv.innerHTML + "<br/>" + this._opts.defaultContent;
  }

  //求多点间距离
  _formatLength(coordinates) {
    //  let wgs84Sphere = new olsphere(6378137);
    let length = 0;

    let sourceProj = this._map.getView().getProjection();
    for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      let c1 = olProj.transform(coordinates[i], sourceProj, "EPSG:4326");
      let c2 = olProj.transform(coordinates[i + 1], sourceProj, "EPSG:4326");

      let geom = new olLineString([c1, c2]);
      // length += wgs84Sphere.haversineDistance(c1, c2);

      length += getLength(geom);
    }
    return length;
  }

  //计算两点间的距离
  _getDistance(pxA, pxB) {
    return this._formatLength([pxA, pxB]);
  }

  //目标点的  当前的步长,position,总的步长,动画效果,回调
  /**
   * 移动小车
   * @param {Number} poi 当前的步长.
   * @param {Point} initPos 经纬度坐标初始点.
   * @param {Point} targetPos 经纬度坐标目标点.
   * @param {Function} effect 缓动效果.
   * @return 无返回值.
   */
  _move(initPos, targetPos, effect, currentCount) {
    let me = this;
    me.ismove = true;
    //当前的帧数
    if (!currentCount) currentCount = 0;
    //步长，米/秒
    let timer = 10,
      step = this._opts.speed / (1000 / timer),
      //初始坐标
      init_pos = this._map.getPixelFromCoordinate(initPos),
      //获取结束点的(x,y)坐标
      target_pos = this._map.getPixelFromCoordinate(targetPos),
      //总的步长
      count = Math.round(me._getDistance(init_pos, target_pos) / step);

    //如果小于1直接移动到下一点
    if (count < 1) {
      me._moveNext(++me.i);
      return;
    }
    //两点之间匀速移动 setInterval
    me._intervalFlag = setInterval(function () {
      //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
      if (currentCount >= count) {
        clearInterval(me._intervalFlag);
        //移动的点已经超过总的长度
        if (me.i > me._path.length) {
          return;
        }
        // me._marker.setTitle(i+'aaa')
        // me._marker.setImageUrl('')
        //运行下一个点
        me._moveNext(++me.i);
      } else {
        currentCount++;
        me._cc = currentCount;
        let x = effect(init_pos[0], target_pos[0], currentCount, count),
          y = effect(init_pos[1], target_pos[1], currentCount, count),
          pos = me._map.getCoordinateFromPixel([x, y]);

        let ele = me._map.getOverlays().getArray()[0].element;
        ele.style.color = "#ff0000";
        ele.innerText = me.nodetype[me.i];
        //
        if (me.nodetype[me.i] === "热带低压") {
          me._marker.setImageUrl(typhoonLogo1); //
        } else if (me.nodetype[me.i] === "热带风暴") {
          me._marker.setImageUrl(typhoonLogo2); //
        } else if (me.nodetype[me.i] === "强热带风暴") {
          me._marker.setImageUrl(typhoonLogo3); //
        } else if (me.nodetype[me.i] === "台风") {
          me._marker.setImageUrl(typhoonLogo4); //
        } else if (me.nodetype[me.i] === "强台风") {
          me._marker.setImageUrl(typhoonLogo5); //
        } else if (me.nodetype[me.i] === "超强台风") {
          me._marker.setImageUrl(typhoonLogo6); //
        }
        // me._marker.setRotation(10);

        //设置marker
        if (currentCount == 1) {
          let proPos = null;
          if (me.i - 1 >= 0) {
            proPos = me._path[me.i - 1];
          }
          if (me._opts.enableRotation == true) {
            me.setRotation(proPos, initPos, targetPos);
          }
          if (me._opts.autoView) {
            console.log("");
          }
        }

        let extent = me._map.getView().calculateExtent(me._map.getSize());
        let bl = getBottomLeft(extent);
        let tr = getTopRight(extent);
        let bb = containsCoordinate([bl[0], bl[1], tr[0], tr[1]], pos);

        //移动中的label
        let overs = me._map.getOverlayById(me._map.title_id);
        overs.setPosition(pos);

        me._marker.setRotation2();

        if (!bb) {
          if (me._opts.autoView) {
            clearInterval(me._intervalFlag);
            me._map.getView().setCenter(pos);
            me._move(initPos, targetPos, me._tween.linear);
          } else {
            me._marker.setPosition(pos, me.i);
          }
        } else {
          me._marker.setPosition(pos, me.i);
        }
      }
    }, timer);
  }

  //在每个点的真实步骤中设置小车转动的角度
  setRotation(prePos, curPos, targetPos) {
    let me = this;

    curPos = me._map.getPixelFromCoordinate(curPos);
    targetPos = me._map.getPixelFromCoordinate(targetPos);

    curPos = { x: curPos[0], y: curPos[1] };
    targetPos = { x: targetPos[0], y: targetPos[1] };

    let x = Math.abs(targetPos.x - curPos.x);
    let y = Math.abs(targetPos.y - curPos.y);
    let z = Math.sqrt(x * x + y * y);
    let ration = Math.round((Math.asin(y / z) / Math.PI) * 180);
    let a = 0;
    if (targetPos.y < curPos.y && targetPos.x == curPos.x) {
      a = 270; // (180 - ration);
    } else if (targetPos.y > curPos.y && targetPos.x == curPos.x) a = 90;
    ///ration;
    else if (targetPos.y == curPos.y && targetPos.x < curPos.x) a = 180;
    //(180 - ration);
    else if (targetPos.y == curPos.y && targetPos.x > curPos.x) a = 0;
    //ration;
    else if (targetPos.y > curPos.y && targetPos.x > curPos.x) a = ration;
    else if (targetPos.y > curPos.y && targetPos.x < curPos.x) a = 180 - ration;
    else if (targetPos.y < curPos.y && targetPos.x < curPos.x) a = 180 + ration;
    else if (targetPos.y < curPos.y && targetPos.x > curPos.x) a = 360 - ration;
    this._marker.setRotation(a);

    return;
  }

  //移动到下一个点
  _moveNext(index) {
    this.ismove = true;
    if (this._opts.func && this._opts.func != "") this._opts.func(index);
    let me = this;
    if (index == me._path.length - 1 && me._opts.circlable) {
      index = 0;
      me.i = 0;
    }
    if (index < this._path.length - 1) {
      //判断是否需要屏幕暂停，移动中心
      let ifXYZ1 = me._path[index];
      let ifXYZ2 = me._path[index + 1];

      let extent = this._map.getView().calculateExtent(this._map.getSize());

      let bl = getBottomLeft(extent);
      let tr = getTopRight(extent);

      tr = [
        this._map.getPixelFromCoordinate(tr)[0] - 30,
        this._map.getPixelFromCoordinate(tr)[1] + 30,
      ];
      bl = [
        this._map.getPixelFromCoordinate(bl)[0] + 30,
        this._map.getPixelFromCoordinate(tr)[1] - 30,
      ];

      tr = this._map.getCoordinateFromPixel(tr);
      bl = this._map.getCoordinateFromPixel(bl);

      let extentA = containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ1);
      let extentB = containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ2);

      //console.log(extentA, extentB);
      if (extentA == false || extentB == false) {
        if (me._opts.autoView) {
          console.log("auto view");
          clearInterval(this._lu_locus._intervalFlag);

          let centerA = (ifXYZ2[0] - ifXYZ1[0]) / 2 + ifXYZ2[0];
          let centerB = (ifXYZ2[1] - ifXYZ1[1]) / 2 + ifXYZ2[1];

          if (extentA == false && extentB == false) {
            this._map.getView().setCenter([centerA, centerB]);
          } else if (extentA == false) {
            this._map.getView().setCenter(ifXYZ1);
          } else if (extentB == false) {
            this._map.getView().setCenter(ifXYZ2);
          } else {
            console.log("#1005853");
            return;
          }
          setTimeout(function () {
            me._move(me._path[index], me._path[index + 1], me._tween.linear);
          }, 100);
        } else {
          me._move(me._path[index], me._path[index + 1], me._tween.linear);
        }
      } else {
        me._move(me._path[index], me._path[index + 1], me._tween.linear);
      }
    }
  }

  //清除暂停后再开始运行的timeout
  _clearTimeout() {
    for (let i in this._setTimeoutQuene) {
      clearTimeout(this._setTimeoutQuene[i]);
    }
    this._setTimeoutQuene.length = 0;
  }
}

class GUID {
  constructor() {
    this.date =
      new Date(); /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
  }

  newGUID() {
    this.date = new Date();
    let guidStr = "";
    let sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
    let sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
    for (let i = 0; i < 9; i++) {
      guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    guidStr += sexadecimalDate;
    guidStr += sexadecimalTime;
    while (guidStr.length < 32) {
      guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    return this.formatGUID(guidStr);
  }
  /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
  getGUIDDate() {
    return (
      this.date.getFullYear() +
      this.addZero(this.date.getMonth() + 1) +
      this.addZero(this.date.getDay())
    );
  }
  /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
  getGUIDTime() {
    return (
      this.addZero(this.date.getHours()) +
      this.addZero(this.date.getMinutes()) +
      this.addZero(this.date.getSeconds()) +
      this.addZero(parseInt(this.date.getMilliseconds() / 10))
    );
  }
  /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
  addZero(num) {
    if (Number(num).toString() != "NaN" && num >= 0 && num < 10) {
      return "0" + Math.floor(num);
    } else {
      return num.toString();
    }
  }

  /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
  hexadecimal(num, x, y) {
    if (y != undefined) {
      return parseInt(num.toString(), y).toString(x);
    } else {
      return parseInt(num.toString()).toString(x);
    }
  }

  /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
  formatGUID(guidStr) {
    let str1 = guidStr.slice(0, 8) + "-",
      str2 = guidStr.slice(8, 12) + "-",
      str3 = guidStr.slice(12, 16) + "-",
      str4 = guidStr.slice(16, 20) + "-",
      str5 = guidStr.slice(20);
    return str1 + str2 + str3 + str4 + str5;
  }
}

class TYCar {
  constructor(lnglat, config) {
    this.mp = document.createElement("div");
    this.mp.id = "mymovecar_" + new GUID().newGUID();
    this.mp.style.position = "absolute";
    this.times = null;

    this.mimg = document.createElement("img");
    if (config.icon) this.mimg.src = config.icon;
    this.mp.appendChild(this.mimg);

    let marker_id = "_ty_lj_key_car_" + new GUID().newGUID();
    this.TYMarker = new Overlay({
      id: marker_id,
      stopEvent: false,
      offset: [-20, -18],
      positioning: "center-center",
      element: this.mp,
    });

    // window.allmarkers[this.mp.id] = this.mp;
    //  console.log(this.mp)
  }

  //    getTitle () {
  //         return mp2.innerHTML;
  //     }

  // TYMarker.setTitle = function (text) {
  //     mp2.innerHTML = text;
  // }

  setPosition(lnglat, index) {
    this.TYMarker.setPosition(lnglat);
  }

  setRotation(a) {
    if (!isNaN(a)) {
      if (a <= 360 && a >= 0) {
        let x = document.getElementById(this.mp.id);
        // let x = window.allmarkers[this.mp.id];
        if (x) {
          x.style.transform = "rotate(" + a + "deg)";
        }
      }
    }
  }

  setRotation2() {
    if (!isNaN(window.a)) {
      window.a -= 2;
      if (window.a <= 360 && window.a >= 0) {
        let x = document.getElementById(this.mp.id);
        // let x = window.allmarkers[this.mp.id];
        if (x) {
          x.style.transform = "rotate(" + window.a + "deg)";
        }
      } else {
        window.a += 360;
      }
    }
  }

  getImageUrl() {
    return this.mimg.src;
  }

  setImageUrl(img_url) {
    this.mimg.src = img_url;
  }
}

onMounted(() => {
  init();
  loadTyphoonTrace();
});
</script>

<style lang="less" scoped>
.dataTable {
  position: absolute;
  z-index: 99;
  right: 40px;
  top: 20px;
  width: 500px;
}
.collapse-button {
}
#dataTableId {
  transition: height 250ms;
}

/deep/.el-radio {
  margin-right: 5px;
}
</style>
