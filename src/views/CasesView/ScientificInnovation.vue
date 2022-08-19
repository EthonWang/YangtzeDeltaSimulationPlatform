<template>
    <div class="scientificPage">
          <el-row class="row">
            <el-col :span="13">
              <div style="height:7vh;background-color: #ffffff;border: 1px solid #DCDCDC;display:flex;align-items:center;justify-content:center;min-height: 60px">
                <p style="font-size: 2em;font-weight: bold; letter-spacing:3px;">
                  长三角科学创新的空间格局仪表盘（ACM论文库）</p>
              </div>
            </el-col>
            <el-col :span="10" :offset="1">
              <div style="height:7vh;margin-left:-20px;background-color: #ffffff;border: 1px solid #DCDCDC;min-height: 60px">
                <p class="blockTitle">地域选择工具栏</p>
                <div class="form-check" style="text-align: center">
                  <el-radio-group v-model="radioArea" @change="checkRadio">
                    <el-radio label="YRD">长三角区域</el-radio>
                    <el-radio label="Shanghai">上海市</el-radio>
                    <el-radio label="Jiangsu">江苏省</el-radio>
                    <el-radio label="Zhejiang">浙江省</el-radio>
                    <el-radio label="Anhui">安徽省</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row class="row">
            <el-col :span="24">
              <div style="height:100px;background-color: #ffffff;border: 1px solid #DCDCDC;">
                <p class="blockTitle"><span>{{area}}</span>排名信息概览（前四）</p>
                <div id="valueGroup" style="width: 95%;margin-left: 10px;display: flex;align-items: center;height: 80px;justify-content: space-around">
                  <template v-for="(item,key) in rankPart" :key="key">
                    <div style="height:60px;padding: 5px">
                      <p style="margin-left:5px;font-size:14px;color:#ff7800;font-weight:bold;font-style:italic;">● {{rankJson[item]}}</p>
                      <template v-for="(item2,key2) in rankList[item]" :key="key2">
                        <span>{{item2}}</span>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <div style="height:58vh;background-color: #ffffff;border: 1px solid #DCDCDC;">
                <p class="blockTitle">创新领域信息概览</p>
                <div id="treemap" style="margin-top:-28px;width:100%;height: 100%;display: flex;justify-content: center">
                  <el-image :src=imagePath></el-image>
                </div>
              </div>
            </el-col>
            <el-col :span="8" :offset="1">
              <div style="margin-top:0px;height:58vh;background-color: #ffffff;border: 1px solid #DCDCDC;">
                <p class="blockTitle"><span id="area-2" v-if="radioArea == 'YRD'">{{area}}</span><span id="area-2" v-else>{{area}}在长三角区域</span>内部合作形态</p>
                <div id='map1' style="margin-top:0px;width: 100%;height: calc(58vh - 32px)"></div>
              </div>
            </el-col>
            <el-col :span="10" :offset="1">
              <div style="height:27vh;background-color: #ffffff;border: 1px solid #DCDCDC;">
                <p class="blockTitle"><span id="area-3">{{area}}</span>与国内其它地区（不含港澳台）合作形态</p>
                <div id='map2' style="margin-top:0px;width: 100%;height: calc(27vh - 32px)"></div>
              </div>
              <div style="height:27vh;background-color: #ffffff;border: 1px solid #DCDCDC;margin-top:4vh;">
                <p class="blockTitle"><span id="area-4">{{area}}</span>与国际及港澳台地区合作形态</p>
                <div id='map3' style="margin-top:0px;width: 100%;height: calc(27vh - 32px)"></div>
              </div>
            </el-col>
          </el-row>
        </div>
</template>

<script setup>
import {ref,onMounted} from "vue";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import canvasFlowmapLayer from "@/components/Cases/CanvasFlowmapLayer";

const d3 = require('d3-dsv');
const area = ref("")
const radioArea = ref("YRD")
const imagePath = ref('')

let labelList = {
  YRD:"长三角区域",
  Shanghai:"上海市",
  Jiangsu:"江苏省",
  Zhejiang :"浙江省",
  Anhui:"安徽省",
}
let rankPart = ref(["area","areapair","chinapair","global"]);
let rankJson = ref({
  area:"内部论文发表",
  areapair: "内部合作对",
  chinapair: "国内合作（不含港澳台地区）",
  global: "国际及港澳台地区合作",
})
let rankList = ref({})

const checkRadio = (label) => {
  area.value = labelList[label];
  getData(label);
  changeImage();
  regionalMap(label);
  globalMap(label);
  chinaMap(label);
}
const changeImage = () => {
  imagePath.value = "/case/scientificInnovation/"+radioArea.value+"/"+radioArea.value+"_treemap.svg"
}
let rawData = []
const getData = (radioArea)=>{
  fetch('/case/scientificInnovation/'+radioArea+'/'+radioArea+'_values.csv').then(res=>{
    return res.text()
  }).then(res=>{
    rawData = d3.csvParse(res);
    rankList.value = {
      area:[],
      areapair:[],
      chinapair:[],
      global:[]
    }
    for(let i = 0; i < rawData.length; i++){
      rankList.value.area.push(rawData[i].area);
      rankList.value.areapair.push(rawData[i].areapair);
      rankList.value.chinapair.push(rawData[i].chinapair);
      rankList.value.global.push(rawData[i].global);
    }
  })
}

//地图部分
let map1;
let jsonLayer;
const loadMap1 = () => {
  map1 = L.map('map1').setView([31.3, 119], 6);
  var CartoBasemap1 = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 10
      }
  ).addTo(map1);

  fetch("/case/scientificInnovation/YRD_cities_projection.json").then(res=>{
    return res.json()
  }).then(jsonData=>{
    jsonLayer = L.geoJSON(jsonData, {
      "color": "#696969",
      "weight": 0.5,
      "fillOpacity": 0,
      onEachFeature: onEachFeature1
    })
    jsonLayer.addTo(map1);
    regionalMap(radioArea.value)
  });
}


let yrdLinksLayer = L.layerGroup();
function regionalMap(area) {
  yrdLinksLayer.clearLayers();
  console.log("jsonLayer",area,jsonLayer)
  jsonLayer.remove();
  if (area == "YRD") {
    fetch("/case/scientificInnovation/YRD_cities_projection.json").then(res=>{
      return res.json()
    }).then(res=>{
      jsonLayer = L.geoJSON(res, {
        "color": "#696969",
        "weight": 0.5,
        "fillOpacity": 0,
        onEachFeature: onEachFeature1
      })
      jsonLayer.addTo(map1)
    })
  } else {
    fetch("/case/scientificInnovation/yrd_districts.json").then(res=>{
      return res.json()
    }).then(res=>{
      jsonLayer = L.geoJSON(res, {
        "color": "#696969",
        "weight": 0.5,
        "fillOpacity": 0,
        onEachFeature: onEachFeature2
      })
      jsonLayer.addTo(map1)
    })
  }
  fetch('/case/scientificInnovation/'+area+'/'+area+'_YRD_nodes.csv').then(res=>{
    return res.text()
  }).then(res=>{
    let nodes = d3.csvParse(res);
    for (var i = 0; i < nodes.length; i++) {
      L.circle([nodes[i].geoY, nodes[i].geoX], {
        radius: getRadius(nodes[i].weight, nodes[0].weight, 'regional'),
        weight: 1,
        color: '#ff7706',
        fillColor: '#ff7706',
        fillOpacity: 0.5,
      }).addTo(yrdLinksLayer)
    }
  })
  fetch('/case/scientificInnovation/'+area+'/'+area+'_YRD_edges.csv').then(res=>{
    return res.text()
  }).then(res=>{
    let edges = d3.csvParse(res);
    var geoJsonFeatureCollection = {}
    geoJsonFeatureCollection.type = 'FeatureCollection'
    geoJsonFeatureCollection.features = []
    for (var i = 0; i < edges.length; i++) {
      var point =
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [edges[i].node1_geoX, edges[i].node1_geoY]
            },
            'properties': {
              'weight': getWidth(edges[i].weight, edges[0].weight),
              'original_ID': edges[i].node1,
              'original_lon': edges[i].node1_geoX,
              'original_lat': edges[i].node1_geoY,
              'destination_ID': edges[i].node2,
              'destination_lon': edges[i].node2_geoX,
              'destination_lat': edges[i].node2_geoY
            }
          }
      geoJsonFeatureCollection.features.push(point)
    }
    var flowmapLayer =new canvasFlowmapLayer(geoJsonFeatureCollection, {
      originAndDestinationFieldIds: {
        weight: 'weight',
        originUniqueIdField: 'original_ID',
        originGeometry: {
          x: 'original_lon',
          y: 'original_lat'
        },
        destinationUniqueIdField: 'destination_ID',
        destinationGeometry: {
          x: 'destination_lon',
          y: 'destination_lat'
        }
      },
      animationStarted: false,
    }).addTo(yrdLinksLayer);
  })
  yrdLinksLayer.addTo(map1);
}
function onEachFeature1(feature, layer) {
  if (feature.properties && feature.properties.CityNameC) {
    layer.bindPopup(feature.properties.CityNameC);
  }
}
function onEachFeature2(feature, layer) {
  if (feature.properties && feature.properties.NAME) {
    layer.bindPopup(feature.properties.NAME);
  }
}
function onEachFeature3(feature, layer) {
  if (feature.properties && feature.properties.NAME) {
    layer.bindPopup(feature.properties.NAME);
  }
}
function getRadius(weight, max, type) {
  if (type == 'regional')
    return (((weight - 1) / (max - 1) * (13 - 1) + 2) * 7000);
  else if (type == 'china')
    return (((weight - 1) / (max - 1) * (13 - 1) + 2) * 7000) * 4;
  else if (type == 'global')
    return (((weight - 1) / (max - 1) * (13 - 1) + 2) * 7000) * 10;
}

function getWidth(weight, max) {
  return ((weight - 1) / (max - 1) * (8 - 1) + 1);
}
let map2;
const loadMap2 = () => {
  map2 = L.map('map2').setView([38, 104], 3);
  var CartoBasemap2 = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }
  ).addTo(map2);
}
var chinaLinksLayer = L.layerGroup();

function chinaMap(area) {
  chinaLinksLayer.clearLayers();
  fetch('/case/scientificInnovation/'+area+'/'+area+'_China_nodes.csv').then(res=>{
    return res.text()
  }).then(res=> {
    let nodes = d3.csvParse(res);
    for (var i = 0; i < nodes.length; i++) {
      L.circle([nodes[i].geoY, nodes[i].geoX], {
        radius: getRadius(nodes[i].weight, nodes[0].weight, 'china'),
        weight: 1,
        color: '#ff7706',
        fillColor: '#ff7706',
        fillOpacity: 0.5,
      }).addTo(chinaLinksLayer)
    }
  })
  fetch('/case/scientificInnovation/'+area+'/'+area+'_China_edges.csv').then(res=>{
    return res.text()
  }).then(res=> {
    let edges = d3.csvParse(res);
    var geoJsonFeatureCollection = {}
    geoJsonFeatureCollection.type = 'FeatureCollection'
    geoJsonFeatureCollection.features = []
    for (var i = 0; i < edges.length; i++) {
      var point =
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [edges[i].node1_geoX, edges[i].node1_geoY]
            },
            'properties': {
              'weight': getWidth(edges[i].weight, edges[0].weight),
              'original_ID': edges[i].node1,
              'original_lon': edges[i].node1_geoX,
              'original_lat': edges[i].node1_geoY,
              'destination_ID': edges[i].node2,
              'destination_lon': edges[i].node2_geoX,
              'destination_lat': edges[i].node2_geoY
            }
          }
      geoJsonFeatureCollection.features.push(point)
    }
    var flowmapLayer = new canvasFlowmapLayer(geoJsonFeatureCollection, {
      originAndDestinationFieldIds: {
        weight: 'weight',
        originUniqueIdField: 'original_ID',
        originGeometry: {
          x: 'original_lon',
          y: 'original_lat'
        },
        destinationUniqueIdField: 'destination_ID',
        destinationGeometry: {
          x: 'destination_lon',
          y: 'destination_lat'
        }
      },
      animationStarted: false,
    }).addTo(chinaLinksLayer);
  })
  chinaLinksLayer.addTo(map2);
}

let map3;
const loadMap3 = () => {
  map3 = L.map('map3').setView([25, 100], 1);
  var CartoBasemap3 = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }
  ).addTo(map3);
}

var globalLinksLayer = L.layerGroup();
function globalMap(area) {
  globalLinksLayer.clearLayers();
  fetch('/case/scientificInnovation/'+area+'/'+area+'_global_nodes.csv').then(res=>{
    return res.text()
  }).then(res=> {
    let nodes = d3.csvParse(res);
    for (var i = 0; i < nodes.length; i++) {
      L.circle([nodes[i].geoY, nodes[i].geoX], {
        radius: getRadius(nodes[i].weight, nodes[0].weight, 'global'),
        weight: 1,
        color: '#ff7706',
        fillColor: '#ff7706',
        fillOpacity: 0.5,
      }).addTo(globalLinksLayer)
    }
  });
  fetch('/case/scientificInnovation/'+area+'/'+area+'_global_edges.csv').then(res=>{
    return res.text()
  }).then(res=> {
    let edges = d3.csvParse(res);
    var geoJsonFeatureCollection = {}
    geoJsonFeatureCollection.type = 'FeatureCollection'
    geoJsonFeatureCollection.features = []
    for (var i = 0; i < edges.length; i++) {
      var point =
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [edges[i].node1_geoX, edges[i].node1_geoY]
            },
            'properties': {
              'weight': getWidth(edges[i].weight, edges[0].weight),
              'original_ID': edges[i].node1,
              'original_lon': edges[i].node1_geoX,
              'original_lat': edges[i].node1_geoY,
              'destination_ID': edges[i].node2,
              'destination_lon': edges[i].node2_geoX,
              'destination_lat': edges[i].node2_geoY
            }
          }
      geoJsonFeatureCollection.features.push(point)
    }
    var flowmapLayer = new canvasFlowmapLayer(geoJsonFeatureCollection, {
      originAndDestinationFieldIds: {
        weight: 'weight',
        originUniqueIdField: 'original_ID',
        originGeometry: {
          x: 'original_lon',
          y: 'original_lat'
        },
        destinationUniqueIdField: 'destination_ID',
        destinationGeometry: {
          x: 'destination_lon',
          y: 'destination_lat'
        }
      },
      animationStarted: false,
    }).addTo(globalLinksLayer);
  });
  globalLinksLayer.addTo(map3);
}
onMounted(()=>{
  area.value = labelList[radioArea.value];
  getData(radioArea.value);
  changeImage();
  loadMap1();
  loadMap2();
  loadMap3();
  globalMap(radioArea.value);
  chinaMap(radioArea.value);
})
</script>

<style scoped>
.scientificPage{
  padding: 30px 45px 0 45px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-width: 1381px;
  width: 100%;
  overflow-x: scroll;
}
@media screen and (min-width:1381px){

}
.form-check-label {
  font-weight: normal;
  font-size: 14px;
}


.blockTitle {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  border-bottom: 1px solid #DCDCDC;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  height:25px;
}
</style>
