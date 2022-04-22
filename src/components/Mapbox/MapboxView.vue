<template>
  <div class="mapbox-page">
    <el-tag class="map-zoom-lnglat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>

    <div style="  position: absolute;  top: 110px;  right: 60px;  z-index: 99;">
      <el-button v-if="!editBoardShow" size="small"  @click="handleEditBoardShow(1)">打开编辑框
      </el-button>
      <el-button v-if="editBoardShow" size="small"  @click="handleEditBoardShow(0)">收起编辑框
      </el-button>
    </div>

    <div class="edit-board" v-if="editBoardShow">
      <el-table :data="showLayerTableList" ref="shpLayerTable" row-key="nameId" size="mini"
                @cell-click="handleLayerClick" style="width: 100%">
        <el-table-column width="50">
          <template #default="scope">
            <el-switch :width="30" v-model="scope.row.show" @change="handleLayerShowSwitchChange($event,scope.row)">
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
                placement="left"
                title="图层编辑"
                width="250"
                trigger="click">

              <!--              点图层编辑-->
              <div v-if="scope.row.type==='circle'">
                {{scope.row.name}}
                <div class="flex-row-start">
                  <h3 style="width: 100px;">颜色:</h3>
                  <el-input v-model="showLayerTableList[scope.$index].paint['circle-color']"
                            @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'circle-color',showLayerTableList[scope.$index].paint['circle-color'])"
                            placeholder="something"
                            size="mini"></el-input>
                  <el-color-picker
                      v-model="showLayerTableList[scope.$index].paint['circle-color']"
                      @change="handlePaintChange(showLayerTableList[scope.$index],'circle-color',showLayerTableList[scope.$index].paint['circle-color'])"
                      :predefine="predefineColors"
                      size="mini">
                  </el-color-picker>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px;">半径（px）:</h3>
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['circle-radius']"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'circle-radius',showLayerTableList[scope.$index].paint['circle-radius'])"
                                   :min="0" :max="99999"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px;">透明度:</h3>
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['circle-opacity']"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'circle-opacity',showLayerTableList[scope.$index].paint['circle-opacity'])"
                                   :min="0"
                                   :max="1"
                                   :step="0.1"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px;">模糊度:</h3>
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['circle-blur']"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'circle-blur',showLayerTableList[scope.$index].paint['circle-blur'])"
                                   :min="0"
                                   :max="1"
                                   :step="0.1"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>
              </div>

              <!--              线图层编辑-->
              <div v-else-if="scope.row.type==='line'">
                <div class="flex-row-start">
                  <h3 style="width: 200px;">颜色:</h3>
                  <el-input v-model="showLayerTableList[scope.$index].paint['line-color']"
                            @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'line-color',showLayerTableList[scope.$index].paint['line-color'])"
                            placeholder="something"
                            size="mini"></el-input>
                  <el-color-picker
                      v-model="showLayerTableList[scope.$index].paint['line-color']"
                      @change="handlePaintChange(showLayerTableList[scope.$index],'line-color',showLayerTableList[scope.$index].paint['line-color'])"
                      :predefine="predefineColors"
                      size="mini">
                  </el-color-picker>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px;">线宽（px）:</h3>
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['line-width']"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'line-width',showLayerTableList[scope.$index].paint['line-width'])"
                                   :min="0" :max="99999"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>

                <div class="flex-row-start">
                  <h3 style="width: 200px;">透明度:</h3>
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['line-opacity']"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'line-opacity',showLayerTableList[scope.$index].paint['line-opacity'])"
                                   :min="0"
                                   :max="1"
                                   :step="0.1"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px;">模糊度:</h3>
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['line-blur']"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'line-blur',showLayerTableList[scope.$index].paint['line-blur'])"
                                   :min="0"
                                   :max="1"
                                   :step="0.1"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 80px;">虚线:</h3>
                  实:&nbsp;
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['line-dasharray'][0]"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'line-dasharray',showLayerTableList[scope.$index].paint['line-dasharray'])"
                                   :min="0"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                  虚:&nbsp;
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['line-dasharray'][1]"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'line-dasharray',showLayerTableList[scope.$index].paint['line-dasharray'])"
                                   :min="0"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>
              </div>

              <!--              面图层编辑-->
              <div v-else>
                <div class="flex-row-start">
                  <h3 style="width: 200px;">颜色:</h3>
                  <el-input v-model="showLayerTableList[scope.$index].paint['fill-color']"
                            @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'fill-color',showLayerTableList[scope.$index].paint['fill-color'])"
                            placeholder="something"
                            size="mini"></el-input>
                  <el-color-picker
                      v-model="showLayerTableList[scope.$index].paint['fill-color']"
                      @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'fill-color',showLayerTableList[scope.$index].paint['fill-color'])"
                      :predefine="predefineColors"
                      size="mini">
                  </el-color-picker>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px;">边线颜色:</h3>
                  <el-input v-model="showLayerTableList[scope.$index].paint['fill-outline-color']"
                            @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'fill-outline-color',showLayerTableList[scope.$index].paint['fill-outline-color'])"
                            placeholder="something"
                            size="mini"></el-input>
                  <el-color-picker
                      v-model="showLayerTableList[scope.$index].paint['fill-outline-color']"
                      @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'fill-outline-color',showLayerTableList[scope.$index].paint['fill-outline-color'])"
                      :predefine="predefineColors"
                      size="mini">
                  </el-color-picker>
                </div>
                <div class="flex-row-start">
                  <h3 style="width: 200px;">透明度:</h3>
                  <el-input-number v-model="showLayerTableList[scope.$index].paint['fill-opacity']"
                                   @change="handlePaintChange(showLayerTableList[scope.$index]['id'],'fill-opacity',showLayerTableList[scope.$index].paint['fill-opacity'])"
                                   :min="0"
                                   :max="1"
                                   :step="0.1"
                                   size="mini"
                                   label="描述文字">
                  </el-input-number>
                </div>
              </div>



              <template #reference>
                <el-button

                    size="mini"
                    type="success"
                    @click="handleLayerEdit(scope.$index, scope.row)"
                    icon="el-icon-edit"
                    circle
                >
                </el-button>
              </template>
            </el-popover>

            <el-button
                size="mini"
                type="danger"
                @click="handleRemoveLayer(scope.$index, scope.row)"
                icon="el-icon-delete"
                circle
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--    <el-button type="primary">Primary</el-button>-->

    <div id="map"></div>
  </div>

</template>

<script>
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

var map = null

export default {
  name: "MapboxView",
  props: ['shpShowList'], //shpShowList为前端勾选的要展示在地图上的shp，格式为[{name:"",type:"",nameId:""}]


  data() {

    return {
      showCenter: "119,32",
      zoom: 9,
      editBoardShow: true,

      layerStyle: {
        line: {
          "layout": {
            "line-cap": "butt", //One of "butt", "round", "square"
            "line-join": "miter",  //One of "bevel", "round", "miter"
            "line-miter-limit": 2,
            "line-round-limit": 1.05,
            "visibility": "visible",
            // "line-sort-key":999
          },
          "paint": {
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
          }
        },
        circle: {
          "layout": {
            "visibility": "visible", //One of "visible", "none"
            // "circle-sort-key":999,
          },
          "paint": {
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
          }
        },
        fill: {
          "layout": {
            "visibility": "visible", //One of "visible", "none"
            // "fill-sort-key":999
          },
          "paint": {
            "fill-antialias": true,
            "fill-color": "#000000",
            "fill-opacity": 1,
            "fill-outline-color": "#000000",
            //"fill-pattern":''  //ignore  Optional resolvedImage.
            "fill-translate": [0, 0],
            "fill-translate-anchor": "map", // One of "map", "viewport"
          }
        }
      },

      showLayerTableList: [],
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585']

    }
  },

  watch: {
    shpShowListCopy: {
      handler(newVal, oldVal) {
        console.log("watch shpShowListCopy: ", newVal, oldVal)

        //添加shp
        if (newVal.length > oldVal.length) {
          for (let i = 0; i < newVal.length; i++) {
            if (newVal.indexOf(oldVal[i]) === -1) {
              this.addLayerToMap(newVal[i])
            }
          }
        } else {//删除shp
          for (let i = 0; i < oldVal.length; i++) {
            if (oldVal.indexOf(newVal[i]) === -1) {
              this.handleRemoveLayer(oldVal[i])
            }
          }
        }
      },
      // immediate: true,
      // deep: true
    }
  },

  computed: {
    shpShowListCopy() {
      return this.shpShowList.slice()
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    //数据部分后台未完成，暂时删掉了部分代码，不然报错

    initMap() {
      mapboxgl.accessToken =
          "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [121, 31],
        zoom: 9,
      });

      var scale = new mapboxgl.ScaleControl({
        maxWidth: 120,
        unit: "imperial",
      });
      map.addControl(scale,"bottom-right");
      scale.setUnit("metric");

      // 添加控件缩放按钮和一个指南针.
      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "bottom-right");
      // 全局缩放
      map.addControl(new mapboxgl.FullscreenControl(),"bottom-right");

      //添加定位控件
      map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),"bottom-right")

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
        this.center = String(e.lngLat.lng) + "," + String(e.lngLat.lat)
        this.showCenter = String(e.lngLat.lng.toFixed(5)) + "," + String(e.lngLat.lat.toFixed(5))
      });
    },

    addLayerToMap(newShpInfo) {
      //newShpInfo:{name:"",type:"",nameId:""}
      console.log("add new layer：" + newShpInfo.name)

      //添加数据源
      map.addSource(newShpInfo.nameId, {
        type: "vector",
        tiles: ["http://172.21.212.63:8899/mvt/" + newShpInfo.name + "/{z}/{x}/{y}.pbf"],
      })

      //添加layer
      let newLayer = {
        show: true,
        name: newShpInfo.name,
        id: newShpInfo.nameId,
        type: newShpInfo.type,
        filter: ["all"],
        layout: this.layerStyle[newShpInfo.type].layout,
        maxzoom: 22,
        metadata: "",
        minzoom: 0,
        paint: this.layerStyle[newShpInfo.type].paint,
        source: newShpInfo.nameId,
        "source-layer": "default"
      }

      this.showLayerTableList.push(newLayer)
      map.addLayer(newLayer)
    },

    handleRemoveLayer(index, row) {
      this.showLayerTableList.splice(index, 1)
      map.removeLayer(row.id);
      map.removeSource(row.id);
    },

    handleLayerClick() {

    },

    handleLayerEdit(index, row) {
      console.log("current edit row:", index, row)
    },

    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible")
      } else {
        this.handleLayoutChange(row.id, "visibility", "none")
      }
    },

    handleEditBoardShow(val) {
      if (val) {
        this.editBoardShow = true
      } else {
        this.editBoardShow = false
      }
    },

    handleLayoutChange(layerName, key, value) {
      console.log("layout:",layerName, key, value)
      map.setLayoutProperty(layerName, key, value);
    },

    handlePaintChange(layerName, key, value) {
      console.log("paint:",layerName, key, value)
      map.setPaintProperty(layerName, key, value);
    }


  },
}

</script>

<style scoped>

.mapbox-page {
  position: absolute;
  width: 100%;
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
  top: 150px;
  right: 60px;
  z-index: 99;
  background-color: white;
  width: 300px;
  height: 50%;
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


</style>