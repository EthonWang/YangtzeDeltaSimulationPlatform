<template>
    <div id="map" style="position:absolute;width: 100%;height: 100%"></div>
</template>

<script setup>
import {onMounted} from "vue";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import {cov19Data_C,cov19Data_D,cov19Data_H,timeList,midOptionData21,midTimeList,midOptionData22,midOptionData23} from 'components/Cases/cov19Data'

const pointData = [
  {name:'南京市',value:2},
  {name:'南通市',value:2},
  {name:'无锡市',value:2},
  {name:'苏州市',value:2},
  {name:'上海市',value:2},
  {name:'杭州市',value:2},
  {name:'宁波市',value:2},
  {name:'合肥市',value:2},
  {name:'常州市',value:1},
  {name:'泰州市',value:1},
  {name:'扬州市',value:1},
  {name:'盐城市',value:1},
  {name:'徐州市',value:1},
  {name:'嘉兴市',value:1},
  {name:'绍兴市',value:1},
  {name:'台州市',value:1},
  {name:'温州市',value:1},
]
const setProperty = () => {
  fetch('/case/economicRun/cityArea.geojson').then(res=>{
    return res.json()
  }).then(json=>{
    let features = json.features;
    for(let i = 0; i < features.length; i++){
      for(let j = 0; j < pointData.length;j++){
        if (features[i].properties.name == pointData[j].name){
          features[i].properties.value = pointData[j].value
        }else {
          features[i].properties.value = 0
        }
      }
    }
    json.features = features;

  })
}
// setProperty()

let map;
onMounted(()=>{
  initMap();
})
const initMap = ()=> {
  mapboxgl.accessToken =
      "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: [118.81893, 31.40936],
    zoom: 5,
  });
  fetch('/case/economicRun/cityArea.geojson').then(res=>{
    return res.json()
  }).then(json=>{
    for(let i = 0; i < json.features.length; i++){
      for(let j = 0; j < pointData.length;j++){
        if (json.features[i].properties.name == pointData[j].name){
          json.features[i].properties.value = pointData[j].value
        }
      }
    }
    map.on('load',function (){
      map.addSource('cityArea',{
        type:"geojson",
        data:json,
      })
      map.addLayer({
        id:'cityArea',
        type:'fill',
        source:'cityArea',
        paint:{
          // 'fill-color':'#0080ff',
          // 'fill-outline-color': '#4f4f4f',
          'fill-color':[
            'case',
            ['==',['get', 'value'],2], 'rgba(101, 108, 147,0.9)',
            ['==',['get', 'value'],1], 'rgba(139, 230, 191,0.9)',
            '#DDDDDD',
          ],
          'fill-outline-color':'#898AA6'
        },
        label:[]
      })
    })
  })

  map.addControl(new MapboxLanguage({defaultLanguage: "zh-Hans"}));
}
</script>

<style scoped>

</style>
