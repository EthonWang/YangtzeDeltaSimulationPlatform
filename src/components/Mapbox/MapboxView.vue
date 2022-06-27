<template>
  <div class="mapbox-page">
    <el-tag class="map-zoom-lnglat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>

    <div style="position: absolute; top: 75px; left: 110px; z-index: 99">
      <el-button
        v-if="!editBoardShow"
        size="small"
        @click="handleEditBoardShow(1)"
        >打开编辑框
      </el-button>
      <el-button
        v-if="editBoardShow"
        size="small"
        @click="handleEditBoardShow(0)"
        >收起编辑框
      </el-button>
    </div>

    <div class="edit-board" v-if="editBoardShow">
      <el-table
        :data="showLayerTableList"
        ref="shpLayerTable"
        row-key="nameId"
        size="small"
        @cell-click="handleLayerClick"
        style="width: 100%"
      >
        <el-table-column width="50">
          <template #default="scope">
            <el-switch
              :width="30"
              v-model="scope.row.show"
              @change="handleLayerShowSwitchChange($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="type"
          min-width="50"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="名称"
          prop="id"
          min-width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" min-width="90">
          <template #default="scope">
            <el-popover
              placement="right"
              title="图层样式"
              width="250"
              trigger="click"
            >
              <!--              点图层编辑-->
              <div v-if="scope.row.type === 'circle'">
                {{ scope.row.name }}
                <div class="flex-row-start">
                  <h3 style="width: 100px">颜色:</h3>
                  <el-input
                    v-model="
                      showLayerTableList[scope.$index].paint['circle-color']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'circle-color',
                        showLayerTableList[scope.$index].paint['circle-color']
                      )
                    "
                    placeholder="something"
                    size="small"
                  ></el-input>
                  <el-color-picker
                    v-model="
                      showLayerTableList[scope.$index].paint['circle-color']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'circle-color',
                        showLayerTableList[scope.$index].paint['circle-color']
                      )
                    "
                    :predefine="predefineColors"
                    size="small"
                  >
                  </el-color-picker>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px">半径（px）:</h3>
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint['circle-radius']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'circle-radius',
                        showLayerTableList[scope.$index].paint['circle-radius']
                      )
                    "
                    :min="0"
                    :max="99999"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px">透明度:</h3>
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint['circle-opacity']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'circle-opacity',
                        showLayerTableList[scope.$index].paint['circle-opacity']
                      )
                    "
                    :min="0"
                    :max="1"
                    :step="0.1"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px">模糊度:</h3>
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint['circle-blur']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'circle-blur',
                        showLayerTableList[scope.$index].paint['circle-blur']
                      )
                    "
                    :min="0"
                    :max="1"
                    :step="0.1"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>
              </div>

              <!--              线图层编辑-->
              <div v-else-if="scope.row.type === 'line'">
                <div class="flex-row-start">
                  <h3 style="width: 200px">颜色:</h3>
                  <el-input
                    v-model="
                      showLayerTableList[scope.$index].paint['line-color']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'line-color',
                        showLayerTableList[scope.$index].paint['line-color']
                      )
                    "
                    placeholder="something"
                    size="small"
                  ></el-input>
                  <el-color-picker
                    v-model="
                      showLayerTableList[scope.$index].paint['line-color']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'line-color',
                        showLayerTableList[scope.$index].paint['line-color']
                      )
                    "
                    :predefine="predefineColors"
                    size="small"
                  >
                  </el-color-picker>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px">线宽（px）:</h3>
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint['line-width']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'line-width',
                        showLayerTableList[scope.$index].paint['line-width']
                      )
                    "
                    :min="0"
                    :max="99999"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px">透明度:</h3>
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint['line-opacity']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'line-opacity',
                        showLayerTableList[scope.$index].paint['line-opacity']
                      )
                    "
                    :min="0"
                    :max="1"
                    :step="0.1"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px">模糊度:</h3>
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint['line-blur']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'line-blur',
                        showLayerTableList[scope.$index].paint['line-blur']
                      )
                    "
                    :min="0"
                    :max="1"
                    :step="0.1"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 80px">虚线:</h3>
                  实:&nbsp;
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint[
                        'line-dasharray'
                      ][0]
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'line-dasharray',
                        showLayerTableList[scope.$index].paint['line-dasharray']
                      )
                    "
                    :min="0"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                  虚:&nbsp;
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint[
                        'line-dasharray'
                      ][1]
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'line-dasharray',
                        showLayerTableList[scope.$index].paint['line-dasharray']
                      )
                    "
                    :min="0"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>
              </div>

              <!--              面图层编辑-->
              <div v-else>
                <div class="flex-row-start">
                  <h3 style="width: 200px">颜色:</h3>
                  <el-input
                    v-model="
                      showLayerTableList[scope.$index].paint['fill-color']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'fill-color',
                        showLayerTableList[scope.$index].paint['fill-color']
                      )
                    "
                    placeholder="something"
                    size="small"
                  ></el-input>
                  <el-color-picker
                    v-model="
                      showLayerTableList[scope.$index].paint['fill-color']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'fill-color',
                        showLayerTableList[scope.$index].paint['fill-color']
                      )
                    "
                    :predefine="predefineColors"
                    size="small"
                  >
                  </el-color-picker>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px">边线颜色:</h3>
                  <el-input
                    v-model="
                      showLayerTableList[scope.$index].paint[
                        'fill-outline-color'
                      ]
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'fill-outline-color',
                        showLayerTableList[scope.$index].paint[
                          'fill-outline-color'
                        ]
                      )
                    "
                    placeholder="something"
                    size="small"
                  ></el-input>
                  <el-color-picker
                    v-model="
                      showLayerTableList[scope.$index].paint[
                        'fill-outline-color'
                      ]
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'fill-outline-color',
                        showLayerTableList[scope.$index].paint[
                          'fill-outline-color'
                        ]
                      )
                    "
                    :predefine="predefineColors"
                    size="small"
                  >
                  </el-color-picker>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px">透明度:</h3>
                  <el-input-number
                    v-model="
                      showLayerTableList[scope.$index].paint['fill-opacity']
                    "
                    @change="
                      handlePaintChange(
                        showLayerTableList[scope.$index]['id'],
                        'fill-opacity',
                        showLayerTableList[scope.$index].paint['fill-opacity']
                      )
                    "
                    :min="0"
                    :max="1"
                    :step="0.1"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number>
                </div>
                <div
                  class="flex-row-start"
                  v-if="
                    showLayerTableList[scope.$index].startEditor != undefined
                  "
                >
                  <h3 style="width: 200px">矢量编辑:</h3>
                  <el-switch
                    :width="30"
                    v-model="showLayerTableList[scope.$index].startEditor"
                    @change="layer2JsonEditor($event, scope.row)"
                  ></el-switch>
                </div>
              </div>
              <template #reference>
                <el-button
                  size="small"
                  type="success"
                  @click="handleLayerEdit(scope.$index, scope.row)"
                >
                  编辑
                </el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--    <el-button type="primary">Primary</el-button>-->

    <div id="map"></div>
  </div>
  <Modal
    v-model="clipModal"
    draggable
    sticky
    scrollable
    :mask="false"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <template #header>
      <Icon type="md-cut" size="18" />
      <span style="margin-left: 5px; font-size: 18px">裁剪</span>
    </template>
    <Form :model="clipForm" label-position="top">
      <FormItem label="输入要素">
        <Input v-model="clipForm.inputFeaturesName" style="width: 90%"></Input>
        <Button
          :size="buttonSize"
          icon="ios-folder-open"
          style="margin-left: 15px"
        ></Button>
      </FormItem>
      <FormItem label="裁剪要素">
        <Input v-model="clipForm.clipFeaturesName" style="width: 90%"></Input>
        <Button
          :size="buttonSize"
          icon="ios-folder-open"
          style="margin-left: 15px"
        ></Button>
      </FormItem>
      <FormItem label="输出要素">
        <Input v-model="clipForm.outputFeaturesName" style="width: 90%"></Input>
        <Button
          :size="buttonSize"
          icon="ios-folder-open"
          style="margin-left: 15px"
        ></Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js"
);
import "mapbox-gl/dist/mapbox-gl.css";
import { toRaw } from "@vue/reactivity";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
var map = null;

export default {
  name: "MapboxView",
  props: ["shpShowList"], //shpShowList为前端勾选的要展示在地图上的shp，格式为[{name:"",type:"",nameId:""}]

  data() {
    return {
      showCenter: "-90,17",
      zoom: 6,
      editBoardShow: true,

      layerStyle: {
        line: {
          layout: {
            "line-cap": "butt", //One of "butt", "round", "square"
            "line-join": "miter", //One of "bevel", "round", "miter"
            "line-miter-limit": 2,
            "line-round-limit": 1.05,
            visibility: "visible",
            // "line-sort-key":999
          },
          paint: {
            "line-blur": 0,
            "line-color": "#000000",
            "line-dasharray": [0, 0],
            "line-gap-width": 0,
            // "line-gradient":"",  //ignore  Requires source to be "geojson".
            "line-offset": 0,
            "line-opacity": 1,
            // "line-pattern": "",  //ignore  Optional resolvedImage.
            "line-translate": [0, 0],
            "line-translate-anchor": "map", //One of "map", "viewport".
            "line-width": 1,
          },
        },
        circle: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "circle-sort-key":999,
          },
          paint: {
            "circle-blur": 0,
            "circle-color": "#000000",
            "circle-opacity": 1,
            "circle-pitch-alignment": "viewport", //One of "map", "viewport"
            "circle-pitch-scale": "map", //One of "map", "viewport"
            "circle-radius": 5,
            "circle-stroke-color": "#000000",
            "circle-stroke-opacity": 1,
            "circle-stroke-width": 0,
            "circle-translate": [0, 0],
            "circle-translate-anchor": "map", // One of "map", "viewport"
          },
        },
        fill: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "fill-sort-key":999
          },
          paint: {
            "fill-antialias": true,
            "fill-color": "#000000",
            "fill-opacity": 1,
            "fill-outline-color": "#000000",
            //"fill-pattern":''  //ignore  Optional resolvedImage.
            "fill-translate": [0, 0],
            "fill-translate-anchor": "map", // One of "map", "viewport"
          },
        },
      },

      showLayerTableList: [],

      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],

      draw: null,
      geojson: {
        features: [],
        type: "FeatureCollection",
      },
      clipModal: false,
      clipForm: {
        inputFeaturesName: "",
        clipFeaturesName: "",
        inputFeaturesId: "",
        clipFeaturesId: "",
        outputFeaturesName: "",
      },
    };
  },

  watch: {
    shpShowListCopy: {
      handler(newVal, oldVal) {
        // console.log("watch shpShowListCopy: ", newVal, oldVal)

        //添加shp
        if (newVal.length > oldVal.length) {
          for (let i = 0; i < newVal.length; i++) {
            if (this.indexOfObject(oldVal, newVal[i].dataSourceId) === -1) {
              this.addLayerToMap(newVal[i]);
              break;
            }
          }
        } else {
          //删除shp

          for (let i = 0; i < oldVal.length; i++) {
            if (this.indexOfObject(newVal, oldVal[i].dataSourceId) === -1) {
              this.handleRemoveLayer(oldVal[i].dataSourceId);
              break;
            }
          }
        }
      },
      // immediate: true,
      // deep: true
    },
  },

  computed: {
    shpShowListCopy() {
      return toRaw(this.shpShowList).slice();
    },
  },

  mounted() {
    this.initMap();
  },

  methods: {
    //数据部分后台未完成，暂时删掉了部分代码，不然报错
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [120, 32],
        zoom: 7,
      });
      map.addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }));

      var Draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          line_string: true,
          polygon: true,
          trash: true,
          combine_features: false,
          uncombine_features: false,
        },
        // modes: modes,
      });
      this.draw = Draw;
      map.addControl(Draw, "top-right");
      map.on("draw.create", this.updateArea);
      map.on("draw.delete", this.updateArea);
      map.on("draw.update", this.updateArea);
      this.setDrawControlStyle();

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
    },

    addLayerToMap(newShpInfo) {
      //添加数据源
      // map.addSource(newShpInfo.dataSourceId, {
      //   type: "vector",
      //   tiles: ["http://172.21.212.63:8995/mvt/"+newShpInfo.dataSourceId+"/{z}/{x}/{y}.pbf?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTEifQ.Ne6qdHY2XgpBNQ74MeO-23ZyF0OahH-AHMbrXqhKlwU"],
      // })

      if (newShpInfo.isBigShp !== undefined) {
        map.addSource(newShpInfo.dataSourceId, {
          type: "vector",
          tiles: [
            "http://172.21.212.63:8995/mvt/" +
              newShpInfo.dataSourceId +
              "/{z}/{x}/{y}.pbf?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTEifQ.Ne6qdHY2XgpBNQ74MeO-23ZyF0OahH-AHMbrXqhKlwU",
          ],
        });
      } else {
        map.addSource(newShpInfo.dataSourceId, {
          type: "geojson",
          // data: "http://172.21.212.63:8999/model/getShpJsonData?shpJsonPath="+newShpInfo.path,
          data: "http://172.21.212.63:8999/store" + newShpInfo.path,
        });
      }

      //添加layer
      let newLayer = {
        show: true,
        name: newShpInfo.label,
        id: newShpInfo.dataSourceId,
        type: newShpInfo.geoType,
        filter: ["all"],
        layout: this.layerStyle[newShpInfo.geoType].layout,
        maxzoom: 22,
        metadata: "",
        minzoom: 0,
        paint: this.layerStyle[newShpInfo.geoType].paint,
        source: newShpInfo.dataSourceId,
        // "source-layer": "default"
      };
      // if (newShpInfo.isBigShp == undefined) {
      //   newLayer.startEditor = false;
      // }

      newLayer.paint[newShpInfo.geoType + "-color"] =
        "#" + Math.random().toString(16).substr(2, 6);
      this.showLayerTableList.push(newLayer);
      map.addLayer(newLayer);
    },

    handleRemoveLayer(aimDataSourceId) {
      for (let i = 0; i < this.showLayerTableList.length; i++) {
        if (this.showLayerTableList[i].id === aimDataSourceId) {
          this.showLayerTableList.splice(i, 1);
          break;
        }
      }
      map.removeLayer(aimDataSourceId);
      map.removeSource(aimDataSourceId);
    },

    handleLayerClick() {},

    handleLayerEdit(index, row) {
      console.log("current edit row:", index, row);
    },

    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible");
      } else {
        this.handleLayoutChange(row.id, "visibility", "none");
      }
    },

    handleEditBoardShow(val) {
      if (val) {
        this.editBoardShow = true;
      } else {
        this.editBoardShow = false;
      }
    },

    handleLayoutChange(layerName, key, value) {
      console.log("layout:", layerName, key, value);
      map.setLayoutProperty(layerName, key, value);
    },

    handlePaintChange(layerName, key, value) {
      console.log("paint:", layerName, key, value);
      map.setPaintProperty(layerName, key, value);
    },

    //用dataSourceId判断，对象在数组中的位置，没有返回-1
    indexOfObject(dataList, aimDataSourceId) {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].dataSourceId === aimDataSourceId) {
          return i;
        }
      }
      return -1;
    },
    setDrawControlStyle() {
      // 添加自定义按钮
      let that = this;
      const drawBox = document.querySelector(".mapboxgl-ctrl-group");
      let saveButtonObj = document.createElement("button");
      // console.log(saveButtonObj);
      saveButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_save ivu-icon ivu-icon-md-filing";
      saveButtonObj.id = "mapbox-gl-draw_save";
      saveButtonObj.title = "保存";
      saveButtonObj.style.fontSize = "16px";
      drawBox.appendChild(saveButtonObj);
      saveButtonObj.addEventListener(
        "click",
        (e) => {
          that.saveTempGeojson();
        },
        true
      );
      let clipButtonObj = document.createElement("button");
      clipButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_clip ivu-icon ivu-icon-md-cut";
      clipButtonObj.id = "mapbox-gl-draw_clip";
      clipButtonObj.title = "裁剪";
      clipButtonObj.style.fontSize = "16px";
      drawBox.appendChild(clipButtonObj);
      clipButtonObj.addEventListener(
        "click",
        (e) => {
          that.clipModalShow();
        },
        true
      );
      // 修改title
      const lineButton = document.querySelector(".mapbox-gl-draw_line");
      lineButton.setAttribute("title", "绘制线段");
      const polygonButton = document.querySelector(".mapbox-gl-draw_polygon");
      polygonButton.setAttribute("title", "绘制多边形");
      const trashButton = document.querySelector(".mapbox-gl-draw_trash");
      trashButton.setAttribute("title", "删除图形");
      // const combineButton = document.querySelector(".mapbox-gl-draw_combine");
      // combineButton.setAttribute("title", "合并");
      // const uncombineButton = document.querySelector(
      //   ".mapbox-gl-draw_uncombine"
      // );
      // uncombineButton.setAttribute("title", "取消合并");
    },
    updateArea() {
      this.geojson = this.draw.getAll();
      console.log(this.geojson);
    },
    saveTempGeojson() {
      if (
        this.geojson.features.length > 0 &&
        map.getSource(this.geojson.features[0].id) == undefined
      ) {
        map.addSource(this.geojson.features[0].id, {
          type: "geojson",
          data: this.geojson,
        });

        //添加layer
        let newLayer = {
          show: true,
          name: this.geojson.features[0].id,
          id: this.geojson.features[0].id,
          type: "fill",
          filter: ["all"],
          layout: this.layerStyle["fill"].layout,
          maxzoom: 22,
          metadata: "",
          minzoom: 0,
          paint: this.layerStyle["fill"].paint,
          source: this.geojson.features[0].id,
          startEditor: false,
          // "source-layer": "default"
        };

        newLayer.paint["fill-color"] =
          "#" + Math.random().toString(16).substr(2, 6);
        this.showLayerTableList.push(newLayer);
        map.addLayer(newLayer);
        this.draw.deleteAll();
        this.geojson = {
          features: [],
          type: "FeatureCollection",
        };
      } else if (map.getSource(this.geojson.features[0].id) != undefined) {
        let tempId = this.geojson.features[0].id;
        this.updateMapSource(this.geojson.features[0].id);
        this.handleLayoutChange(tempId, "visibility", "visible");
        for (let i = 0; i < this.showLayerTableList.length; i++) {
          if (this.showLayerTableList[i].id == tempId) {
            this.showLayerTableList[i].startEditor = false;
          }
        }
      }
    },
    layer2JsonEditor(val, row) {
      // let layer = this.showLayerTableList[index];
      // console.log(val);
      if (val) {
        this.closeAllEditorStatus(row.id);
        this.handleLayoutChange(row.id, "visibility", "none");
        let data = map.getSource(row.id);
        console.log(data);
        this.draw.add(data._data);
        this.geojson = data._data;
      } else {
        this.updateMapSource(row.id);
        this.handleLayoutChange(row.id, "visibility", "visible");
      }
    },
    closeAllEditorStatus(id) {
      let list = this.showLayerTableList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].startEditor && list[i].id != id) {
          this.updateMapSource(list[i].id);
          this.handleLayoutChange(list[i].id, "visibility", "visible");
          list[i].startEditor = false;
        }
      }
    },
    updateMapSource(id) {
      if (map.getSource(id) != undefined && this.geojson.features.length > 0) {
        let style = {};
        for(let i = 0 ; i < this.showLayerTableList.length ; i++){
          if(this.showLayerTableList[i].id == id){
            style.layout = this.showLayerTableList[i].layout;
            style.paint = this.showLayerTableList[i].paint;
          }
        }
        map.removeLayer(id);
        map.removeSource(id);
        map.addSource(id, {
          type: "geojson",
          data: this.geojson,
        });
        //添加layer
        let newLayer = {
          show: true,
          name: id,
          id: id,
          type: "fill",
          filter: ["all"],
          layout: style.layout,
          maxzoom: 22,
          metadata: "",
          minzoom: 0,
          paint: style.paint,
          source: id,
          startEditor: false,
          // "source-layer": "default"
        };

        // newLayer.paint["fill-color"] =
        //   "#" + Math.random().toString(16).substr(2, 6);
        // this.showLayerTableList.push(newLayer);
        map.addLayer(newLayer);
        this.draw.deleteAll();
        this.geojson = {
          features: [],
          type: "FeatureCollection",
        };
      }
    },
    clipModalShow() {
      this.clipModal = true;
      this.clipForm = {
        inputFeaturesId: "",
        clipFeaturesId: "",
        outputFeaturesName: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.mapbox-page {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0px;
  bottom: 0px;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.map-zoom-lnglat {
  position: absolute;
  bottom: 60px;
  right: 50px;
  z-index: 99;
  /*background-color: #ffffff !important;*/
  font-size: 13px;
}

.edit-board {
  position: absolute;
  top: 110px;
  left: 40px;
  z-index: 99;
  background-color: white;
  width: 300px;
  height: 80vh;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 3.2px 7.2px 0 rgb(0 0 0 / 13%), 0 0.6px 1.8px 0 rgb(0 0 0 / 11%);
}

.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
/deep/.mapboxgl-ctrl-top-right {
  margin-top: 3.5%;
}
</style>