<!-- mapbox -->
<template>
  <div class="swmm">
    <div
      class="tool"
      style="
        margin-left: 10px;
        margin-top: 10px;
        border-radius: 15px;
        opacity: 0.8;
      "
    >
      <el-tabs
        v-model="activeName"
        type="card"
        style="height: 100%"
        stretch
        id="tab"
      >
        <el-tab-pane label="管网图" name="first" style="height: 100%">
          <el-tabs
            v-loading="loading"
            v-model="activeName1"
            tab-position="left"
            style="height: 100%"
            @tab-click="handleClick"
            stretch
          >
            <el-tab-pane label="72mm" name="quo_5">
              <div class="spart">
                <div class="select">
                  <div><h3>选择点属性</h3></div>
                  <el-radio-group
                    style="margin: 5px"
                    v-model="NT_showInPop"
                    size="large"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Inflow" name="Inflow"
                      >入流量</el-radio-button
                    >
                    <el-radio-button label="Flooding" name="Flooding"
                      >管点溢流</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管点深度</el-radio-button
                    >
                    <el-radio-button label="Head" name="Head"
                      >管点水头</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <div class="select">
                  <div><h3>选择线属性</h3></div>
                  <el-radio-group
                    v-model="LT_showInPop"
                    size="large"
                    style="margin: 5px"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Flow" name="Flow"
                      >管线流量</el-radio-button
                    >
                    <el-radio-button label="Velocity" name="Velocity"
                      >水流速度</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管线深度</el-radio-button
                    >
                    <el-radio-button label="Capacity" name="Capacity"
                      >管线容量</el-radio-button
                    >
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="89mm" name="quo_10">
              <div class="spart">
                <div class="select">
                  <div><h3>选择点属性</h3></div>
                  <el-radio-group
                    style="margin: 5px"
                    v-model="NT_showInPop"
                    size="large"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Inflow" name="Inflow"
                      >入流量</el-radio-button
                    >
                    <el-radio-button label="Flooding" name="Flooding"
                      >管点溢流</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管点深度</el-radio-button
                    >
                    <el-radio-button label="Head" name="Head"
                      >管点水头</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <div class="select">
                  <div><h3>选择线属性</h3></div>
                  <el-radio-group
                    v-model="LT_showInPop"
                    size="large"
                    style="margin: 5px"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Flow" name="Flow"
                      >管线流量</el-radio-button
                    >
                    <el-radio-button label="Velocity" name="Velocity"
                      >水流速度</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管线深度</el-radio-button
                    >
                    <el-radio-button label="Capacity" name="Capacity"
                      >管线容量</el-radio-button
                    >
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="104mm" name="quo_20">
              <div class="spart">
                <div class="select">
                  <div><h3>选择点属性</h3></div>
                  <el-radio-group
                    style="margin: 5px"
                    v-model="NT_showInPop"
                    size="large"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Inflow" name="Inflow"
                      >入流量</el-radio-button
                    >
                    <el-radio-button label="Flooding" name="Flooding"
                      >管点溢流</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管点深度</el-radio-button
                    >
                    <el-radio-button label="Head" name="Head"
                      >管点水头</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <div class="select">
                  <div><h3>选择线属性</h3></div>
                  <el-radio-group
                    v-model="LT_showInPop"
                    size="large"
                    style="margin: 5px"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Flow" name="Flow"
                      >管线流量</el-radio-button
                    >
                    <el-radio-button label="Velocity" name="Velocity"
                      >水流速度</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管线深度</el-radio-button
                    >
                    <el-radio-button label="Capacity" name="Capacity"
                      >管线容量</el-radio-button
                    >
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="112mm" name="quo_30">
              <div class="spart">
                <div class="select">
                  <div><h3>选择点属性</h3></div>
                  <el-radio-group
                    style="margin: 5px"
                    v-model="NT_showInPop"
                    size="large"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Inflow" name="Inflow"
                      >入流量</el-radio-button
                    >
                    <el-radio-button label="Flooding" name="Flooding"
                      >管点溢流</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管点深度</el-radio-button
                    >
                    <el-radio-button label="Head" name="Head"
                      >管点水头</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <div class="select">
                  <div><h3>选择线属性</h3></div>
                  <el-radio-group
                    v-model="LT_showInPop"
                    size="large"
                    style="margin: 5px"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Flow" name="Flow"
                      >管线流量</el-radio-button
                    >
                    <el-radio-button label="Velocity" name="Velocity"
                      >水流速度</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管线深度</el-radio-button
                    >
                    <el-radio-button label="Capacity" name="Capacity"
                      >管线容量</el-radio-button
                    >
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="121mm" name="quo_50">
              <div class="spart">
                <div class="select">
                  <div><h3>选择点属性</h3></div>
                  <el-radio-group
                    style="margin: 5px"
                    v-model="NT_showInPop"
                    size="large"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Inflow" name="Inflow"
                      >入流量</el-radio-button
                    >
                    <el-radio-button label="Flooding" name="Flooding"
                      >管点溢流</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管点深度</el-radio-button
                    >
                    <el-radio-button label="Head" name="Head"
                      >管点水头</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <div class="select">
                  <div><h3>选择线属性</h3></div>
                  <el-radio-group
                    v-model="LT_showInPop"
                    size="large"
                    style="margin: 5px"
                    @change="selectChange"
                    class="radioDiv"
                    fill="#409EFF"
                    text-color="#ffffff"
                  >
                    <el-radio-button label="Flow" name="Flow"
                      >管线流量</el-radio-button
                    >
                    <el-radio-button label="Velocity" name="Velocity"
                      >水流速度</el-radio-button
                    >
                    <el-radio-button label="Depth" name="Depth"
                      >管线深度</el-radio-button
                    >
                    <el-radio-button label="Capacity" name="Capacity"
                      >管线容量</el-radio-button
                    >
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- File -->
        </el-tab-pane>
        <!-- <el-tab-pane label="水深图" name="second"> -->
        <!-- 按照热力图处理水深数据 -->

        <!-- </el-tab-pane> -->
        <!-- <el-tab-pane label="Simulation" name="third">Simulation</el-tab-pane>
          <el-tab-pane label="Coupling analysis" name="fourth">Coupling analysis</el-tab-pane> -->
      </el-tabs>
      <div
        id="time-slider"
        style="
          background: white;
          border-radius: 15px;
          width: 100%;
          bottom: -20%;
        "
      >
        <el-slider
          v-model="timeSlider"
          @change="sliderChange"
          :step="1"
          :min="1"
          :max="maxSlider"
          :marks="marks"
          :format-tooltip="formatTooltip"
          style="width: 80%; margin: auto;left: 15px;"
        >
        </el-slider>
        <el-button
          size="small"
          round
          style="margin-bottom: 5px !important"
          @click="startAnimation"
          :disabled="startBtn"
          >Start</el-button
        >
        <el-button
          size="small"
          round
          style="margin-bottom: 5px !important"
          @click="pauseAnimation"
          :disabled="pauseBtn"
          >Pause</el-button
        >
      </div>
    </div>
    <div id="map" class="swmmMap"></div>
  </div>
</template>
<script setup>
//样式引入
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl";
import * as echarts from "echarts";
import $ from "jquery";
import axios from "axios";
import { reactive, ref, toRefs, onMounted } from "vue";
//定义变量使用
const mapboxgl = require("mapbox-gl");
let echar = ref("");
let showInPop = reactive({
  NT_showInPop: "Inflow",
  LT_showInPop: "Flow",
});
let { NT_showInPop, LT_showInPop } = toRefs(showInPop);
let dialog = reactive({
  fileDialog: false,
  propertySelectVisible: false,
  swmmVisualDialog: false,
  echartsDialog: false,
});
let { fileDialog, propertySelectVisible, swmmVisualDialog, echartsDialog } =
  toRefs(dialog);
let rptResult = ref({});
let isCollapse = true;
let loading = ref(false);
let uploadFiles = ref([]);
let selData = [];
let selTitle = "";
let geojson = ref("");
let geojsonObject = ref({});
let geojsonLayer = Object;
let viewer = Object;
let fileList = ref([]);
let flag = ref(-1);
let activeName = ref("first");
let activeName1 = ref("quo_5");
let dispArr = [];
let dispJSON = {};
let timeSlider = ref(0);
let timeSliderMap = ref(true);
let layerNumber = ref(0);
let nodeLinkInit = reactive({
  nodemin: 0,
  nodemax: 0,
  nodestep: 1,
  linkmin: 0,
  linkmax: 0,
  linkstep: 1,
});
let { nodemin, nodemax, nodestep, linkmin, linkmax, linkstep } =
  toRefs(nodeLinkInit);
let maxSlider = ref(10);
let marks = ref({});
let map = ref({});
let numberAnima = ref(0);
let nodeResultArr = ref([]);
let options = ref([
  {
    value: "node",
    label: "Node Results",
    children: [],
  },
  {
    value: "link",
    label: "Link Results",
    children: [],
  },
]);
let linkResultArr = ref([]);
let btn = reactive({
  startBtn: true,
  pauseBtn: true,
  conduitStartBtn: true,
});
let { startBtn, pauseBtn, conduitStartBtn } = toRefs(btn);
let intevalAnima = ref(null);
let curDateIndex = 0;
let curYear = "5year";
let NodePopType = [
  { value: "Inflow" },
  { value: "Flooding" },
  { value: "Depth" },
  { value: "Head" },
];
let LinkPopType = [
  { value: "Flow" },
  { value: "Velocity" },
  { value: "Depth" },
  { value: "Capacity" },
];
onMounted(() => {
  initmap();
  openFileDialog(`${activeName1.value}.disp`, "quo.geojson")
  loading.value=false
});
const initmap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibGltaW5neXVhbiIsImEiOiJjbDFvZXQ0dDcxM3VlM2JvYjB5Nnp0b2ZmIn0.m-HbmTaL15VUII9cyDNzpg";
  map.value = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [120.845998, 31.037172],
    zoom: 15,
  });
};
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
const selectChange = (value) => {
  SetPop(layerNumber.value - 1);
};
const handleClick = (tab, event) => {
  openFileDialog(`${tab.props.name}.disp`, "quo.geojson");
};
const getrptResult = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const getGeojson = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const initEchart = (x, y, id, chart_name) => {
  echar.value = echarts.init(document.getElementById(id));
  let data = y;
  let date = x;
  // 指定图表的配置项和数据
  let option1 = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [chart_name],
    },
    grid: {
      left: "10%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },

    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      data: date,
    },
    yAxis: {
      type: "value",
    },

    series: [
      {
        name: chart_name,
        type: "line",
        data: data,
      },
    ],
  };
  echar.value.clear();
  echar.value.setOption(option1);
};
const openFileDialog = (disp_url, geo_url) => {
  pauseAnimation();
  loading.value = true;
  let f = getrptResult(disp_url);
  let ff = getGeojson(geo_url);

  Promise.all([f, ff]).then((array) => {
    rptResult.value = array[0];
    geojsonObject.value = array[1];
    options.value = [
      {
        value: "node",
        label: "Node Results",
        children: [],
      },
      {
        value: "link",
        label: "Link Results",
        children: [],
      },
    ];
    // chart Tab
    for (let i = 0; i < rptResult.value.Node.length; i++) {
      let node = rptResult.value.Node[i];
      let nodeResult = rptResult.value.NodeResults[i];
      let child = {
        value: node.toLowerCase(),
        label: node,
        children: [
          {
            value: "Inflow",
            label: "入流量(m³/s)",
            data: nodeResult.Inflow,
          },
          {
            value: "Flooding",
            label: "管点溢流(m³/s)",
            data: nodeResult.Flooding,
          },
          {
            value: "Depth",
            label: "管点深度(m)",
            data: nodeResult.Depth,
          },
          {
            value: "Head",
            label: "管点水头(m)",
            data: nodeResult.Head,
          },
        ],
      };
      options.value[0].children.push(child);
    }
    for (let j = 0; j < rptResult.value.Link.length; j++) {
      let link = rptResult.value.Link[j];
      let linkResult = rptResult.value.LinkResults[j];
      let child = {
        value: link.toLowerCase(),
        label: link,
        children: [
          {
            value: "Flow",
            label: "管道流量(m³/s)",
            data: linkResult.Flow,
          },
          {
            value: "Velocity",
            label: "水流速度(m/s)",
            data: linkResult.Velocity,
          },
          {
            value: "Depth",
            label: "管道水深(m)",
            data: linkResult.Depth,
          },
          {
            value: "Capacity",
            label: "管道容量",
            data: linkResult.Capacity,
          },
        ],
      };
      options.value[1].children.push(child);
    }
    changeChooseMap();
    if (layerNumber.value > 0) {
      map.value.removeLayer(`vectorLayer${layerNumber.value - 1}line`);
      map.value.removeLayer(`vectorLayer${layerNumber.value - 1}point`);
      map.value.removeSource(`source-id${layerNumber.value - 1}`);

      layerNumber.value--;
    }
    map.value.addSource(`source-id${layerNumber.value}`, {
      type: "geojson",
      data: geojsonObject.value,
    });
    let ll = 1;
    map.value.addLayer({
      id: `vectorLayer${layerNumber.value}line`,
      type: "line",
      source: `source-id${layerNumber.value}`,
      paint: {
        "line-width": 3,
        "line-color": [
          "case",
          ["<", ["get", "value"], nodeLinkInit.linkmin],
          "#ffffff", //<10.8
          [
            "<",
            ["get", "value"],
            nodeLinkInit.linkmin + ll * nodeLinkInit.linkstep,
          ],
          "#51e1e6", //>=10.8 & <17.2
          [
            "<",
            ["get", "value"],
            nodeLinkInit.linkmin + (ll + 1) * nodeLinkInit.linkstep,
          ],
          "#40a9d9",
          [
            "<",
            ["get", "value"],
            nodeLinkInit.linkmin + (ll + 2) * nodeLinkInit.linkstep,
          ],
          "#3175ce",
          [
            "<=",
            ["get", "value"],
            nodeLinkInit.linkmin + (ll + 3) * nodeLinkInit.linkstep,
          ],
          "#2549c4",
          [
            "<=",
            ["get", "value"],
            nodeLinkInit.linkmin + (ll + 4) * nodeLinkInit.linkstep,
          ],
          "#140fb8", //>=41.5 & <50.1
          "#140fb8", // 默认值, >=50.1
        ],
      },
      filter: ["in", "$type", "LineString"],
    });

    map.value.addLayer({
      id: `vectorLayer${layerNumber.value}point`,
      type: "circle",
      source: `source-id${layerNumber.value}`,
      paint: {
        "circle-color": [
          "case",
          ["<", ["get", "value"], nodeLinkInit.nodemin],
          "#ffffff", //<10.8
          [
            "<",
            ["get", "value"],
            nodeLinkInit.nodemin + ll * nodeLinkInit.nodestep,
          ],
          "#fdd519", //>=10.8 & <17.2
          [
            "<",
            ["get", "value"],
            nodeLinkInit.nodemin + (ll + 1) * nodeLinkInit.nodestep,
          ],
          "#f8a114",
          [
            "<",
            ["get", "value"],
            nodeLinkInit.nodemin + (ll + 2) * nodeLinkInit.nodestep,
          ],
          "#f36f0f",
          [
            "<=",
            ["get", "value"],
            nodeLinkInit.nodemin + (ll + 3) * nodeLinkInit.nodestep,
          ],
          "#ee430b",
          [
            "<=",
            ["get", "value"],
            nodeLinkInit.nodemin + (ll + 4) * nodeLinkInit.nodestep,
          ],
          "#e90806", //>=41.5 & <50.1
          "#e90806", // 默认值, >=50.1
        ],
      },
      filter: ["in", "$type", "Point"],
    });
    SetPop(layerNumber.value);
    layerNumber.value++;

    // slider
    timeSliderMap.value = false;
    maxSlider.value = rptResult.value.Date.length;
    marks.value = {
      1: formatTooltip(1),
    };
    // btn
    btn.startBtn = false;
    btn.conduitStartBtn = false;
    setTimeout(function () {
      loading.value = false;
    }, 300);
  });
};
const Npopclick = (e) => {
  e.preventDefault();
  // Copy coordinates array.
  const coordinates = e.features[0].geometry.coordinates.slice();
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  let y = options.value[0].children
    .find((child) => child.label == e.features[0].properties.name)
    .children.find((Flooding) => Flooding.value == showInPop.NT_showInPop).data;
  let x = rptResult.value.Date;
  new mapboxgl.Popup({
    className: "Point_pop",
    maxWidth: "800px",
  })
    .setLngLat(e.lngLat)
    .setHTML(
      "<div id=" + "e_chart_P" + " style='height:400px;width:600px;'></div>"
    )
    .addTo(map.value);
  setTimeout(() => {
    initEchart(x, y, "e_chart_P", showInPop.NT_showInPop);
  }, 1);
};
const LPopclick = (e) => {
  if (e.defaultPrevented) {
    console.log("");
  } else {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    let y = options.value[1].children
      .find((child) => child.label == e.features[0].properties.name)
      .children.find(
        (Flooding) => Flooding.value == showInPop.LT_showInPop
      ).data;
    let x = rptResult.value.Date;
    new mapboxgl.Popup({ maxWidth: "800px" })
      .setLngLat(e.lngLat)
      .setHTML("<div id='e_chart_L' style='height:400px;width:600px;'></div>")
      .addTo(map.value);
    setTimeout(() => {
      initEchart(x, y, "e_chart_L", showInPop.LT_showInPop);
    }, 1);
  }
};
const menter = () => {
  map.value.getCanvas().style.cursor = "pointer";
};
const mleave = () => {
  map.value.getCanvas().style.cursor = "";
};
const SetPop = (layerN) => {
  if (map.value._listeners.click) {
    if (map.value._listeners.click.length > 0) {
      map.value.off("click", `vectorLayer${layerN}point`, Npopclick);
      map.value.off("click", `vectorLayer${layerN}line`, LPopclick);
      map.value.off("mouseenter", `vectorLayer${layerN}point`, menter);
      map.value.off("mouseleave", `vectorLayer${layerN}point`, mleave);
      map.value.off("mouseenter", `vectorLayer${layerN}line`, menter);
      map.value.off("mouseleave", `vectorLayer${layerN}line`, mleave);
    }
  }
  map.value.on("mouseenter", `vectorLayer${layerN}point`, menter);
  map.value.on("mouseleave", `vectorLayer${layerN}point`, mleave);
  map.value.on("mouseenter", `vectorLayer${layerN}line`, menter);
  map.value.on("mouseleave", `vectorLayer${layerN}line`, mleave);
  map.value.on("click", `vectorLayer${layerN}point`, Npopclick);
  map.value.on("click", `vectorLayer${layerN}line`, LPopclick);
};
const changeChooseMap = () => {
  // 还原slider
  numberAnima.value = 0;
  timeSlider.value = 1;

  loading.value = true;
  propertySelectVisible = false;
  // 获取所有要素的选中属性
  nodeResultArr.value = [];
  linkResultArr.value = [];
  for (let i = 0; i < options.value[0].children.length; i++) {
    // node
    let node = options.value[0].children[i];
    let element = node.children.find(
      (Flooding) => Flooding.value == showInPop.NT_showInPop
    );
    nodeResultArr.value.push(element.data); // 汇总该属性的所有模拟值
  }
  for (let k = 0; k < rptResult.value.Node.length; k++) {
    // 更新geojsonObject
    let feat = geojsonObject.value.features[k];
    feat.properties.value = nodeResultArr.value[k][0];
  }
  for (let i = 0; i < options.value[1].children.length; i++) {
    // link
    let link = options.value[1].children[i];
    let element = link.children.find(
      (Flooding) => Flooding.value == showInPop.LT_showInPop
    );
    linkResultArr.value.push(element.data);
  }
  for (let linkItem = 0; linkItem < rptResult.value.Link.length; linkItem++) {
    // 更新geojsonObject
    let feat =
      geojsonObject.value.features[rptResult.value.Node.length + linkItem];
    feat.properties.value = linkResultArr.value[linkItem][0];
  }
  // 获取最大最小值
  if (showInPop.NT_showInPop == "Inflow") {
    // node
    nodeLinkInit.nodemin = rptResult.value.MaxMin.node.minInflow;
    nodeLinkInit.nodemax = rptResult.value.MaxMin.node.maxInflow;

    let max = rptResult.value.MaxMin.node.maxInflow;
    nodeLinkInit.nodestep = (nodeLinkInit.nodemax - nodeLinkInit.nodemin) / 5;
  } else if (showInPop.NT_showInPop == "Flooding") {
    nodeLinkInit.nodemin = rptResult.value.MaxMin.node.minFlooding;
    nodeLinkInit.nodemax = rptResult.value.MaxMin.node.maxFlooding;
    nodeLinkInit.nodestep = (nodeLinkInit.nodemax - nodeLinkInit.nodemin) / 5;
  } else if (showInPop.NT_showInPop == "Depth") {
    nodeLinkInit.nodemin = rptResult.value.MaxMin.node.minDepth;
    nodeLinkInit.nodemax = rptResult.value.MaxMin.node.maxDepth;
    nodeLinkInit.nodestep = (nodeLinkInit.nodemax - nodeLinkInit.nodemin) / 5;
  } else if (showInPop.NT_showInPop == "Head") {
    nodeLinkInit.nodemin = rptResult.value.MaxMin.node.minHead;
    nodeLinkInit.nodemax = rptResult.value.MaxMin.node.maxHead;
    nodeLinkInit.nodestep = (nodeLinkInit.nodemax - nodeLinkInit.nodemin) / 5;
  }
  if (showInPop.LT_showInPop == "Flow") {
    // link
    nodeLinkInit.linkmin = rptResult.value.MaxMin.link.minFlow;
    nodeLinkInit.linkmax = rptResult.value.MaxMin.link.maxFlow;
    nodeLinkInit.linkstep = (nodeLinkInit.linkmax - nodeLinkInit.linkmin) / 5;
  } else if (showInPop.LT_showInPop == "Velocity") {
    nodeLinkInit.linkmin = rptResult.value.MaxMin.link.minVelocity;
    nodeLinkInit.linkmax = rptResult.value.MaxMin.link.maxVelocity;
    nodeLinkInit.linkstep = (nodeLinkInit.linkmax - nodeLinkInit.linkmin) / 5;
  } else if (showInPop.LT_showInPop == "Depth") {
    nodeLinkInit.linkmin = rptResult.value.MaxMin.link.minDepth;
    nodeLinkInit.linkmax = rptResult.value.MaxMin.link.maxDepth;
    nodeLinkInit.linkstep = (nodeLinkInit.linkmax - nodeLinkInit.linkmin) / 5;
  } else if (showInPop.LT_showInPop == "Capacity") {
    nodeLinkInit.linkmin = rptResult.value.MaxMin.link.minCapacity;
    nodeLinkInit.linkmax = rptResult.value.MaxMin.link.maxCapacity;
    nodeLinkInit.linkstep = (nodeLinkInit.linkmax - nodeLinkInit.linkmin) / 5;
  }
  map.value.setZoom(14);
  map.value.setCenter({ lng: 120.845, lat: 31.037 });
  sliderChange(1);
};
const confirmLoad = () => {};
const selectFile = () => {
  $("#uploadFile").click();
};
const uploadChange = (file, fileList) => {
  uploadFiles.value = fileList;
};
//将展示的geojson加载入cesium
const addGeoJson = (json) => {};
const changeEcharts = (dispResult) => {};
//加载第几幅图层
//加载第几年的第几幅图层
const loadFenhuLayer = (flag, year, reload) => {};
//时间线变动函数
const sliderChange = (val) => {
  numberAnima.value = val - 1;
  for (let i = 0; i < rptResult.value.Node.length; i++) {
    // 更新geojsonObject
    let feat = geojsonObject.value.features[i];
    feat.properties.value = nodeResultArr.value[i][numberAnima.value];
  }
  for (let k = 0; k < rptResult.value.Link.length; k++) {
    // 更新geojsonObject
    let feat = geojsonObject.value.features[rptResult.value.Node.length + k];
    feat.properties.value = linkResultArr.value[k][numberAnima.value];
  }
  // 更新openlayer
  // refreshOpenlayer();
};
const refreshOpenlayer = () => {
  map.value
    .getSource(`source-id${layerNumber.value - 1}`)
    .setData(geojsonObject.value);
};
const formatTooltip = (val) => {
  if (rptResult.value.Date != undefined) {
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let dateDay = rptResult.value.Date[val - 1].split(/ +/)[0];
    let dateSec = rptResult.value.Date[val - 1].split(/ +/)[1];
    let nyr = dateDay.split("-");
    let hms = dateSec.split(":");
    let dateStr = `${nyr[2]}/${nyr[1]}/`;
    for (let i = 0; i < month.length; i++) {
      if (month[i].toLowerCase().includes(nyr[0].toLowerCase())) {
        dateStr += ("0" + (i + 1)).slice(-2) + " " + hms.join(":");
      }
    }
    return dateStr;
  }
};
const startAnimation = () => {
  btn.startBtn = true;
  btn.pauseBtn = false;
  intevalAnima = setInterval(() => {
    if (numberAnima.value == rptResult.value.Date.length) {
      numberAnima.value = 0;
      timeSlider.value = 1;
    }
    for (let i = 0; i < rptResult.value.Node.length; i++) {
      // 更新geojsonObject
      let feat = geojsonObject.value.features[i];
      geojsonObject.value.features[i].properties.value =
        nodeResultArr.value[i][numberAnima.value];
    }
    for (let k = 0; k < rptResult.value.Link.length; k++) {
      // 更新geojsonObject
      let feat = geojsonObject.value.features[rptResult.value.Node.length + k];
      geojsonObject.value.features[
        rptResult.value.Node.length + k
      ].properties.value = linkResultArr.value[k][numberAnima.value];
    }
    // 更新openlayer
    refreshOpenlayer();
    numberAnima.value++;
    timeSlider.value++;
  }, 1000);
};
const pauseAnimation = () => {
  btn.startBtn = false;
  btn.pauseBtn = true;

  clearInterval(intevalAnima);
};
// },
// };
</script>

<style scope>
.el-tab-pane {
  height: 100%;
}
.el-tabs__content {
  height: 90%;
}
.el-tabs__nav.is-left {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.el-tabs__item.is-left {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex: 1;
}
.spart {
  display: flex;
  width: 100%;
  height: 100%;
}
.select {
  flex: 1;
  height: 100%;
}
.el-radio-group {
  width: 80%;
}
.radioDiv {
  align-items: stretch;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
}
.el-radio-button {
  flex: 1;
  width: 100%;
  height: 100%;
}
.el-radio-button__inner {
  width: 100%;
  height: 100%;
  line-height: height;
  border-radius: 6px !important;
  border: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.swmmMap {
  height: calc(100vh);
}

.mapboxgl-popup {
  max-width: 800px;
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
#e_chart .absolute {
  position: absolute;
  top: 80px;
  right: 0;
  width: 200px;
  height: 100px;
  border: 3px solid #73ad21;
}
.tool {
  background: white;
  height: 60%;
  width: 25%;
  position: absolute;
  /* top: 40%; */
  z-index: 1000;
  /* left: 0%; */
  margin-left: 10px;
  margin-top: 10px;
  border-radius: 15px;
  opacity: 0.8;
  transition: width 2s;
  transition: height 2s;
}
.el-slider__marks-text{
  left: 5% !important;
}
#time-slider {
  text-align: center;
  z-index: 10000;
  position: absolute;
  bottom: 70px;
  width: 30%;
}
#test {
  position: inherit;
}
</style>
