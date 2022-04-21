<template>
  <div class="mapbox-page">
    <el-tag class="map-zoom-lnglat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>

    <div style="  position: absolute;  top: 60px;  right: 60px;  z-index: 99;">
      <el-button v-if="!editBoardShow" size="small" icon="el-icon-arrow-down" @click="handleEditBoardShow(1)">打开编辑框
      </el-button>
      <el-button v-if="editBoardShow" size="small" icon="el-icon-arrow-up" @click="handleEditBoardShow(0)">收起编辑框
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
      map.addControl(scale);
      scale.setUnit("metric");

      // 添加控件缩放按钮和一个指南针.
      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "top-right");
      // 全局缩放
      map.addControl(new mapboxgl.FullscreenControl());

      //添加定位控件
      map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }))

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

    handleEditBoardShow(val) {
      if (val) {
        this.editBoardShow = true
      } else {
        this.editBoardShow = false
      }
    },

    handleLayerShowSwitchChange() {

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
  top: 10px;
  right: 60px;
  z-index: 99;
  /*background-color: #ffffff !important;*/
  font-size: 13px;
}

.edit-board {
  position: absolute;
  top: 90px;
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