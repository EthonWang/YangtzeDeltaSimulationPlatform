<template>
      <el-row class="row">
        <el-col :span="7">
          <div style="height:10vh;background-color: #fafafa;border: 1px solid #DCDCDC;display:flex;align-items:center;justify-content:center;min-height: 94px">
            <p style="font-size: 2em;font-weight: bold; letter-spacing:3px;">
              江苏省工业创新环境仪表盘(2018年)</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="height:10vh;margin-left:2vw;background-color: #fafafa;border: 1px solid #DCDCDC;min-height: 94px;min-width: 227px;">
            <p class="blockTitle">活力因子选择框</p>
            <div class="form-check" style="height:calc(10vh - 25px);display: flex;align-items: center;width: 100%;justify-content: center;min-width: 227px;">
              <el-radio-group v-model="radioCate" @change="checkRadio">
                <el-radio label="enco">经济活力</el-radio>
                <el-radio label="soci">社会活力</el-radio>
                <el-radio label="envi">环境活力</el-radio>
                <el-radio label="tech">科技活力</el-radio>
              </el-radio-group>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div style="height:10vh;margin-left:2vw;background-color: #fafafa;border: 1px solid #DCDCDC;min-height: 94px;">
            <p class="blockTitle">地级市高亮选择框</p>
            <div id="cityGroup" style="display: flex;height:9vh;overflow: scroll;">
              <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group
                  v-model="checkedCities"
                  @change="handleCheckedCitiesChange"
              >
                <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                    city
                  }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="10">
          <div style="height:72vh;background-color: #fafafa;border: 1px solid #DCDCDC;min-height: calc(385px + 30vh);">
            <p class="blockTitle">工业创新环境综合指标分布图</p>
            <div id='map' style="width: 100%;height:90%;"></div>
            <el-image :src="legendImagePath" style="margin-left:10px;height: 150px;margin-top: -150px;"></el-image>
          </div>
        </el-col>
        <el-col :span="14">
          <el-row style="margin-left: 45px">
            <el-col :span="8">
              <div style="height:39vh;background-color: #fafafa;border: 1px solid #DCDCDC;min-height: 355px;min-width: 256px">
                <p class="blockTitle">江苏省<span id="cate1">{{cateName}}</span>总值</p>
                <div id="valueGroup"></div>
              </div>
            </el-col>
            <el-col :span="16">
              <div style="margin-left:30px;height:39vh;background-color: #fafafa;border: 1px solid #DCDCDC;min-height: 355px">
                <p class="blockTitle"><span id="cate2">{{cateName}}</span>相关性概览图</p>
                <div style="display: flex;justify-content: center">
                  <el-image :src=imagePath style="height: calc(38vh - 25px);margin-left: 0px;min-height: 320px"></el-image>
                  <img src="/case/industrialInnovation/legend.png" style="width:50px;height: calc(38vh - 25px)">
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px;margin-left: 45px">
            <el-col :span="24">
              <div style="height: 30vh;background-color: #fafafa;border: 1px solid #DCDCDC;">
                <p class="blockTitle">各市<span id="cate3">{{cateName}}</span>对比图</p>
                <div id="contrastChart" style="height: 30vh"></div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
</template>

<script setup>
import * as d3 from 'd3';
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import mapboxgl from 'mapbox-gl';
import city_geojson from "@/components/Cases/city_boundary_simplified"
import city_points from "@/components/Cases/city_geocenter"
import {useRoute} from "vue-router";

const checkAll = ref(false);
const isIndeterminate = ref(true)
const checkedCities = ref()
const cities = ["南京市", "无锡市", "徐州市", "常州市", "苏州市", "南通市", "连云港市", "淮安市", "盐城市", "扬州市", "镇江市", "泰州市", "宿迁市"];
const originalColorList = ['#d68565', '#228B22', '#a999da', '#A52A2A', '#DA70D6', '#578fe1', '#c2de5c', '#E9967A', '#696969', '#a26ca3', '#32CD32', '#FFD700', '#DB7093'];
const handleCheckAllChange = (val) => {
  checkedCities.value = val ? cities : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}

const radioCate = ref('enco');
const cateName = ref('经济活力');
const imagePath = ref('');
const legendImagePath = ref('');
const checkRadio = (label) => {
  radioCate.value = label;
  cateName.value = labelList[label];
  updateValues(radioCate.value);
  addCorrImage(radioCate.value);
  addMapLegend(radioCate.value);
  loadChart(radioCate.value);
  addMap(radioCate.value);
}
let labelList = {
  enco:"经济活力",
  soci:"社会活力",
  envi:"环境活力",
  tech :"科技活力",
}

onMounted(()=>{
  myChart = echarts.init(document.getElementById("contrastChart"));
  updateValues(radioCate.value);
  addCorrImage(radioCate.value);
  addMapLegend(radioCate.value);
  loadChart(radioCate.value);
  addMap(radioCate.value);
})
//使echarts高度宽度自动变化
window.onresize = () =>{
  myChart.resize();
}

function addCorrImage(cate) {
  imagePath.value = "/case/industrialInnovation/"+cate+".png"
}
function addMapLegend(cate) {
  legendImagePath.value = "/case/industrialInnovation/"+cate+"-legend.png"
}
let myChart;

function loadChart(cate){
  let parallelAxis = [];
  let data = []
  fetch("/case/industrialInnovation/"+cate+".csv").then(res=>{
    return res.text()
  }).then(res=>{
    let rawData = d3.csvParse(res);
    let keys = [];
    for(let key in rawData[0]){
      keys.push(key);
    }
    for(let i = 2;i<keys.length;i++){
      parallelAxis.push({
        dim: i-2,
        name: keys[i],
      });
    }
    parallelAxis.push({ dim: keys.length-2, name: '地级市名称',type:'category',data:cities })

    for(let i = 0;i < rawData.length;i++){
      let dataItem = []
      for (let j = 2;j < keys.length;j++){
        dataItem.push(rawData[i][keys[j]])
      }
      dataItem.push(rawData[i]['地级市名称'])
      data.push(dataItem)
    };
    myChart.setOption( {
      color:originalColorList,
      parallelAxis: parallelAxis,
      series: {
        type: 'parallel',
        lineStyle: {
          width: 2,
        },
        data: data,
      }
    })
  })
}

function updateValues(cate) {
  document.getElementById('valueGroup').innerHTML = "";
  fetch("/case/industrialInnovation/" + cate + "-jiangsu.csv").then(res=>{
    return res.text()
  }).then(res=>{
    let csvdata = d3.csvParse(res);
    for (let i = 0; i < 6; i++) {
      var createDiv1 = document.createElement("div");
      var createDiv2 = document.createElement("div");
      var lable1 = document.createElement("label");
      var lable2 = document.createElement("p");
      // var lable3 = document.createElement("p");
      createDiv1.id = "valueSet1" + i.toString();
      createDiv2.id = "valueSet2" + i.toString();
      lable1.id = "name" + i.toString();
      lable2.id = "value" + i.toString();
      // lable3.id = "unit" + i.toString();
      createDiv1.style = "width:18vw; height: 50px;position: absolute; left: 10px;top:" + (Math.floor(i * 54 + 30)).toString() + "px";
      createDiv2.style = " border:1.5px solid  #C0C0C0;width:90%;height:40px;margin-top:10px;"
      lable1.style = " font-size:12px;background: hsl(0,0,98%);position: relative; top:-13px;left: 5px;color:#ff7800;font-weight:normal;"
      lable2.style = "font-size:16px;margin-top:-12px;margin-right:5px;font-weight:bold;color:#696969;text-align: right;"
      // lable3.style = "font-size:12px;margin-top:-10px;margin-right:5px;color:#696969;text-align: right;"
      lable1.innerHTML = csvdata[i].name + "<br>"
      lable2.innerHTML = csvdata[i].value + "&nbsp;" + csvdata[i].unit
      // lable3.innerHTML = r[i].unit
      document.getElementById('valueGroup').appendChild(createDiv1);
      document.getElementById(createDiv1.id).appendChild(createDiv2);
      document.getElementById(createDiv2.id).appendChild(lable1);
      document.getElementById(createDiv2.id).appendChild(lable2);
      // document.getElementById(createDiv2.id).appendChild(lable3);
    }
  })
}
var map;
const address = "/case/industrialInnovation/";
const radar_size = 0.09;
const screenWidth = window.screen.width * window.devicePixelRatio;
const screenHeight = window.screen.height * window.devicePixelRatio;

const route = useRoute();
let wPath = window.document.location.href;
let pathName =  route.path;
let pos = wPath.indexOf(pathName);
let localhostPath = wPath.substring(0, pos);
function addMap(cate) {
  console.log(window.screen.width,window.screen.height)
  let baseUrl = localhostPath;
  console.log("dd",process.env.BASE_URL)
  let spriteUrl;
  if((screenWidth == 1920 && screenHeight == 1080)||(screenWidth == 2048 && screenHeight == 1152)){
    spriteUrl =baseUrl+ "/YangtzeVGLab/case/industrialInnovation/mapbox_resource/sprite/" + cate + "@2x";
  }else if(screenWidth == 2560 && screenHeight == 1440) {
    spriteUrl = baseUrl+"/YangtzeVGLab/case/industrialInnovation/mapbox_resource/sprite/" + cate;
  }
  document.getElementById('map').innerHTML = "";
  mapboxgl.accessToken =
      "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
  map = new mapboxgl.Map({
    container: 'map',
    center: [119.2, 33], // starting position [lng, lat]
    zoom: 5.9, // starting zoom
    style: {
      "version": 8,
      "sprite": spriteUrl,
      "glyphs": "/YangtzeVGLab/case/industrialInnovation/mapbox_resource/fonts/{fontstack}/{range}.pbf",
      "sources": {
        'boundary': {
          type: 'geojson',
          data: city_geojson,
        },
        'city': {
          type: 'geojson',
          data: city_points,
        }
      },
      "layers": [
        {
          'id': 'boundary',
          'type': 'fill',
          'source': 'boundary',
          'layout': {},
          "paint": {
            "fill-color": "hsl(0, 0%, 86%)",
            "fill-outline-color": "#696969"
          }
        },
        {
          "id": "highlight",
          "type": "line",
          "source": "boundary",
          "layout": {"visibility": "none"},
          "paint": {"line-color": "#696969", "line-width": 1.5}
        },
        {
          "id": "cityname",
          "type": "symbol",
          "source": "city",
          "layout": {
            "text-field": ["to-string", ["get", "city_cn"]],
            "text-size": 10,
            "text-allow-overlap": true,
            "text-offset": [
              "match",
              ["get", "city_cn"],
              ["淮安市"],
              ["literal", [2, -2]],
              ["徐州市"],
              ["literal", [3.2, 0]],
              ["镇江市"],
              ["literal", [1.7, -2.2]],
              ["无锡市"],
              ["literal", [1.5, -2.3]],
              ["苏州市"],
              ["literal", [2, -2.3]],
              ["扬州市"],
              ["literal", [0.4, -2.3]],
              ["泰州市"],
              ["literal", [-0.4, -2.5]],
              ["常州市"],
              ["literal", [-2.5, 2]],
              ["literal", [0, -2.3]]
            ]
          },
          "paint": {"text-color": "#696969"}
        }
      ]
    },
  });
  if (cate == "enco") {
    map.on('load', function () {
      map.addLayer({
        "id": "icon",
        "type": "symbol",
        "source": "city",
        "layout": {
          "icon-offset": [0, 0],
          "icon-image": [
            "match",
            ["get", "city_cn"],
            ["南京市"],
            "nanjing_enco",
            ["无锡市"],
            "wuxi_enco",
            ["徐州市"],
            "xuzhou_enco",
            ["常州市"],
            "changzhou",
            ["苏州市"],
            "suzhou_enco",
            ["南通市"],
            "nantong_enco",
            ["连云港市"],
            "lianyungang_enco",
            ["淮安市"],
            "huaian_enco",
            ["盐城市"],
            "yancheng_enco",
            ["扬州市"],
            "yangzhou_enco",
            ["镇江市"],
            "zhenjiang_enco",
            ["泰州市"],
            "taizhou_enco",
            ["宿迁市"],
            "suqian_enco",
            "%E5%9B%BE%E7%89%871"
          ],
          "icon-size": radar_size
        },
        "paint": {"icon-translate": [0, 0]}
      })
    })
  } else if (cate == "soci") {
    map.on('load', function () {
      map.addLayer({
        "id": "icon",
        "type": "symbol",
        "source": "city",
        "layout": {
          "icon-offset": [0, 0],
          "icon-image": [
            "match",
            ["get", "city_cn"],
            ["南京市"],
            "nanjing_soci",
            ["无锡市"],
            "wuxi_soci",
            ["徐州市"],
            "xuzhou_soci",
            ["常州市"],
            "changzhou_soci",
            ["苏州市"],
            "suzhou_soci",
            ["南通市"],
            "nantong_soci",
            ["连云港市"],
            "lianyungang_soci",
            ["淮安市"],
            "huaian_soci",
            ["盐城市"],
            "yancheng_soci",
            ["扬州市"],
            "yangzhou_soci",
            ["镇江市"],
            "zhenjiang_soci",
            ["泰州市"],
            "taizhou_soci",
            ["宿迁市"],
            "suqian_soci",
            "%E5%9B%BE%E7%89%871"
          ],
          "icon-size": radar_size
        },
        "paint": {"icon-translate": [0, 0]}
      })
    })
  } else if (cate == "envi") {
    map.on('load', function () {
      map.addLayer({
        "id": "icon",
        "type": "symbol",
        "source": "city",
        "layout": {
          "icon-offset": [0, 0],
          "icon-image": [
            "match",
            ["get", "city_cn"],
            ["南京市"],
            "nanjing_envi",
            ["无锡市"],
            "wuxi_envi",
            ["徐州市"],
            "xuzhou_envi",
            ["常州市"],
            "changhzou_envi",
            ["苏州市"],
            "suzhou_envi",
            ["南通市"],
            "nantong_envi",
            ["连云港市"],
            "lianyungang_envi",
            ["淮安市"],
            "huaian_envi",
            ["盐城市"],
            "yancheng_envi",
            ["扬州市"],
            "yangzhou_envi",
            ["镇江市"],
            "zhenjiang_envi",
            ["泰州市"],
            "taizhou_envi",
            ["宿迁市"],
            "suqian_envi",
            "%E5%9B%BE%E7%89%871"
          ],
          "icon-size": radar_size
        },
        "paint": {"icon-translate": [0, 0]}
      })
    })
  } else if (cate == "tech") {
    map.on('load', function () {
      map.addLayer({
        "id": "icon",
        "type": "symbol",
        "source": "city",
        "layout": {
          "icon-offset": [0, 0],
          "icon-image": [
            "match",
            ["get", "city_cn"],
            ["南京市"],
            "nanjing_tech",
            ["无锡市"],
            "wuxi_tech",
            ["徐州市"],
            "xuzhou_tech",
            ["常州市"],
            "changzhou_tech",
            ["苏州市"],
            "suzhou_tech",
            ["南通市"],
            "nantong_tech",
            ["连云港市"],
            "lianyungang_tech",
            ["淮安市"],
            "huaiai_tech",
            ["盐城市"],
            "yancheng_tech",
            ["扬州市"],
            "yangzhou_tech",
            ["镇江市"],
            "zhenjiang_tech",
            ["泰州市"],
            "taizhou_tech",
            ["宿迁市"],
            "suqian_tech",
            "%E5%9B%BE%E7%89%871"
          ],
          "icon-size": radar_size
        },
        "paint": {"icon-translate": [0, 0]}
      })
    })
  }

}
</script>

<style scoped>
.row {
  margin-top: 28px;
  margin-left: 45px;
  margin-right: 45px;
}
.form-check-label {
  font-weight: normal;
}
.blockTitle {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  border-bottom: 1px solid #DCDCDC;
  text-align: center;
  font-weight: bold;
  height: 25px;
}
</style>
