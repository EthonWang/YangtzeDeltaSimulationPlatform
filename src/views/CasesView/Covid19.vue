<template>
  <div class="covid19Page">
    <el-row class="cov-title">
      <dv-decoration-8 style="width:300px;height:50px;" />
      <h1 class="font-title">2020长三角新冠疫情专题</h1>
      <dv-decoration-8 :reverse="true" style="width:300px;height:50px;" />
    </el-row>
    <el-row>
      <el-col :span="7">
        <div class="left1 marginBox">
          <dv-border-box10 :color="['#0078AA','#A6D1E6']">
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.left1}}</h3></dv-decoration-7>
            <el-button-group  size="small" style="position: absolute;right: 5%;top:5%;z-index: 99">
              <el-button :type="buttonType[0]" @click="GDPClick('GDP',0)"  round>GDP</el-button>
              <el-button :type="buttonType[1]" @click="GDPClick('PPI',1)" >PPI</el-button>
              <el-button :type="buttonType[2]" @click="GDPClick('CPI',2)">CPI</el-button>
              <el-button :type="buttonType[3]" @click="GDPClick('工业',3)" round>工业</el-button>
            </el-button-group>
            <chart-case id="leftChart1" :option="leftOption1" :style="chartStyle"></chart-case>
          </dv-border-box10>
        </div>
        <div class="left2 marginBox">
          <dv-border-box10 :color="['#0078AA','#A6D1E6']">
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.left2}}</h3></dv-decoration-7>
            <chart-case id="leftChart2" :option="leftOption2" :style="chartStyle"></chart-case>
          </dv-border-box10>
        </div>
        <div class="left3">
          <dv-border-box10 :color="['#0078AA','#A6D1E6']">
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.left3}}</h3></dv-decoration-7>
            <chart-case id="leftChart3" :option="leftOption3" :style="chartStyle"></chart-case>
          </dv-border-box10>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="mid1 marginBox">
          <dv-border-box1 >
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.mid1}}</h3></dv-decoration-7>
            <div id="midChart1"  style="position: relative;width: 94%;height: 90%;top: 5%;left: 3%"></div>
          </dv-border-box1>
        </div>
        <div class="mid2">
          <dv-border-box1 >
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.mid2}}</h3></dv-decoration-7>
            <chart-case id="midOption2a" :option="midOption21" style="width: 100%;height: 33%;padding: 15px 0 0 0;"></chart-case>
            <chart-case id="midOption2b" :option="midOption22" :style="midStyle"></chart-case>
            <chart-case id="midOption2c" :option="midOption23" :style="midStyle"></chart-case>
          </dv-border-box1>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="right1 marginBox">
          <dv-border-box10 :color="['#0078AA','#A6D1E6']">
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.right1}}</h3></dv-decoration-7>
            <div style="display: flex;padding: 10px">
              <div style="display:flex;justify-content: space-around;flex-direction: column;position: absolute;height: 100%">
                <p>迁入</p>
                <p>迁出</p>
              </div>
              <div style="display:flex;justify-content: space-around;position: absolute;width: 100%">
                <p>上海</p>
                <p>浙江</p>
              </div>
              <div style="padding-top: 20px;padding-left: 10px">
                <el-row style="justify-content: space-around;align-items: center;margin-bottom: 15px">
                  <el-image :src="QG_SH" class="in-out-image"></el-image>
                  <el-image :src="QG_ZJ" class="in-out-image"></el-image>
                </el-row>
                <el-row style="justify-content: space-around;align-items: center">
                  <el-image :src="SH_QG" class="in-out-image"></el-image>
                  <el-image :src="ZJ_QG" class="in-out-image"></el-image>
                </el-row>
              </div>
            </div>
          </dv-border-box10>
        </div>
        <div class="right2 marginBox">
          <dv-border-box10 :color="['#0078AA','#A6D1E6']">
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.right2}}</h3></dv-decoration-7>
            <chart-case id="rightOption2" :option="rightOption2" :style="chartStyle"></chart-case>
          </dv-border-box10>
        </div>
        <div class="right3 marginBox">
          <dv-border-box10 :color="['#0078AA','#A6D1E6']">
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">{{boxTitle.right3}}</h3></dv-decoration-7>
            <chart-case id="rightOption3" :option="rightOption3" :style="chartStyle"></chart-case>
          </dv-border-box10>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import ChartCase from "components/Cases/chartCase";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "echarts/extension/bmap/bmap";
import * as echarts from 'echarts';

const QG_SH = require('@/assets/img/cases/QG-SH.gif');
const QG_ZJ = require('@/assets/img/cases/QG-ZJ.gif');
const SH_QG = require('@/assets/img/cases/SH-QG.gif');
const ZJ_QG = require('@/assets/img/cases/ZJ-QG.gif');


const buttonType = ref(['primary','warning','warning','warning'])
const GDPClick = (type,index)=>{
  for(let i = 0;i<4;i++){
    if(i == index){
      buttonType.value[i] = 'primary'
    }else {
      buttonType.value[i] = 'warning'
    }
  }
}

let midChart1;
onMounted(()=>{
  midChart1 = echarts.init(document.getElementById('midChart1'));
  loadMidChart1();
})
const chartStyle = ref({})
chartStyle.value = {
  width: "100%",
  height: "100%",
  padding: 0,
}
const midStyle = ref({})
midStyle.value = {
  width: "100%",
  height: "30%",
  padding: 0,
}

const themeColor = ['#C56183','#4FD3C4','#488FB1','#C9BBCF','#247881'];

const chartData = {
  leftOption1:{
    type:['GDP','第一产业','第二产业','第二产业'],
    value:['456.6144','26.0530','172.759','257.8024'],
    increasePercent:['-1.6','0.9','-1.9','-1.6']
  },
  leftOption2:{
    type:['17.Q2', '17.Q3', '17.Q4', '18.Q1', '18.Q2', '18.Q3', '18.Q4', '19.Q1', '19.Q2', '19.Q3', '19.Q4', '20.Q1', '20.Q2'],
    legend:['货币政策感受指数','贷款总体需求指数','银行贷款审批指数','银行业景气指数','银行盈利指数'],
    data:[
      [36.6, 40.4, 41.6, 39.7, 40.6, 51.6, 53.1, 58.4, 55.2, 54.5, 55.1, 72.7, 74.6],
      [66.9, 64.2, 65.7, 70.9, 66.7, 65.2, 63.0, 70.4, 66.2, 65.9, 65.3, 66.0, 75.8],
      [46.1, 45.1, 46.4, 44.6, 44.0, 47.7, 49.8, 51.4, 51.5, 51.1, 50.6, 64.7, 60.8],
      [65.0, 65.8, 68.3, 69.7, 66.4, 67.5, 68.7, 71.2, 70.6, 70.2, 70.7, 58.3, 63.9],
      [65.8, 66.5, 68.3, 65.9, 66.9, 66.9, 65.7, 66.7, 66.7, 66.7, 67.6, 50.5, 62.1]
    ]
  },
  leftOption3:{
    cityList:['上海', '苏州', '杭州', '南京', '无锡', '宁波', '南通', '合肥', '常州', '盐城', '绍兴', '扬州', '泰州', '台州', '芜湖'],
    legend:['GDP','财政'],
    GDP:[173.568,
      90.5024,
      73.88,
      66.1235,
      55.1632,
      54.872,
      46.6435,
      44.197,
      34.7101,
      26.8602,
      26.6115,
      26.538,
      24.0173,
      23.5253,
      17.0678],
    financial:[393.56,
      121.267,
      127.6,
      89.708,
      54.514,
      164.84,
      34.42,
      78.126,
      31.43,
      20.08,
      47.0688,
      46.0688,
      19.91,
      42.419,
      32.7999]
  },
  midOption2:{
    cityList: ['上海市', '南京市', '杭州市', '合肥市', '苏州市', '无锡市', '宁波市', '南通市', '常州市', '绍兴市', '芜湖市', '盐城市', '扬州市', '泰州市', '台州市'],
    value1:[4.8945, 5.0501, 5.295, 5.1378, 5.3889, 5.3678, 5.5165, 5.3257, 5.349, 5.3989, 5.0966, 4.8963, 5.2517, 5.3676, 5.4304],
  },
  rightOption2:{
    type:['紧张', '害怕', '恐慌', '焦虑', '无聊', '失眠', '烦闷', '无力感', '兴奋', '放松', '愉快', '心情稳定'],
    legend:['短期影响','中期影响','长期影响'],
    data:[
      [27.1, 16.8, 15.0, 30.0, 37.5, 12.8, 20.0, 18.3, 4.6, 11.2, 5.0, 32.3],
      [34.1, 18.9, 20.0, 30.1, 41.8, 12.9, 20.9, 21.1, 4.6, 8.8, 5.0, 31.9],
      [46.4, 32.5, 28.9, 38.8, 31.9, 17.1, 22.5, 22.6, 6.9, 8.8, 5.0, 21.1]
    ]
  }
}

const boxTitle = ref({
  left1:"全国2020年上半年经济概况",
  left2:"2020年上半年发布银行问卷调查指数",
  left3:"长三角2020年上半年经济概况",
  mid1:"长三角新冠疫情演变地图",
  mid2:"2020年长三角主要城市迁徙分析",
  right1:"上海、浙江迁入迁出概况",
  right2:"疫情期间居民心理健康演变",
  right3:"2020年上半年长三角省会城市空气质量指数",
})
const leftOption1 = ref({})
leftOption1.value = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: 'white'
      }
    }
  },
  grid: {
    top:'30%',
    left: '3%',
    right: '4%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: chartData.leftOption1.type,
      axisPointer: {
        type: 'shadow'
      },
      axisLabel: {
        show: true,
        color:'white'
      }

    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '单位:千亿元',
      nameTextStyle:{
        color:'#fff'
      },
      min: 0,
      max: 700,
      interval: 100,
      axisLabel: {
        formatter: '{value}',
        color:'white'
      },
    },
    {
      type: 'value',
      name: '单位:%',
      nameTextStyle:{
        color:'#fff'
      },
      min: -6,
      max: 1,
      interval: 1,
      axisLabel: {
        formatter: '{value}',
        color:'white'
      }
    }
  ],
  series: [
    {
      name: '',
      type: 'bar',
      color:'#C56183',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 千亿元';
        }
      },

      data: chartData.leftOption1.value
    },
    {
      name: '',
      type: 'line',
      color:'#36a0d6',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' %';
        }
      },
      data: chartData.leftOption1.increasePercent
    }
  ]
};

const leftOption2 = ref({})
leftOption2.value = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  color:['#C56183','#4FD3C4','#488FB1','#C9BBCF','#247881'],
  legend: {
    textStyle:{
      color:'#fff',
      fontSize: 14,
    },
    itemWidth:25,
    top:"6%"
  },
  grid: {
    top:'30%',
    left: '3%',
    right: '4%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'value',
      axisLabel:{
        color:'#fff'
      }
    },
  ],
  yAxis: [
    {
      type: 'category',
      data: chartData.leftOption2.type,
      axisLabel:{
        color:'#fff'
      }
    }
  ],
  series: [
    {
      name: chartData.leftOption2.legend[0],
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftOption2.data[0]
    },
    {
      name: chartData.leftOption2.legend[1],
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftOption2.data[1]
    },
    {
      name: chartData.leftOption2.legend[2],
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftOption2.data[2]
    },
    {
      name: chartData.leftOption2.legend[3],
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftOption2.data[3]
    },
    {
      name: chartData.leftOption2.legend[4],
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftOption2.data[4]
    },
  ]
};

const leftOption3 = ref({})
leftOption3.value = {
  polar: {
    radius: [30, '70%']
  },
  color:['#C56183','#4FD3C4'],
  radiusAxis: {
    max: 400
  },
  legend:{
    show:true,
    data:chartData.leftOption3.legend
  },
  angleAxis: {
    type: 'category',
    data: chartData.leftOption3.cityList,
    startAngle: 75,
    color:'#fff',
    axisLabel: {
      show: true,
      color:'#fff'
    },
  },
  tooltip: {},
  series: [
    {
      type: 'bar',
      data: chartData.leftOption3.GDP,
      coordinateSystem: 'polar',
      label: {
        show: false,
        position: 'middle',
        formatter: '{b}: {c}'
      }
    },
    {
      type: 'bar',
      data: chartData.leftOption3.financial,
      coordinateSystem: 'polar',
      label: {
        show: false,
        position: 'middle',
        formatter: '{b}: {c}'
      }
    },
  ],
  animation: true
};


const loadMidChart1 = () => {
  fetch('/case/economicRun/cityArea.geojson').then(res=>{
    return res.json()
  }).then(json=>{
    echarts.registerMap('cityMap',json);
    let option = {
      bmap: {
        center: [118.81893, 32.09936],
        zoom: 6,
        roam: true,
        mapStyle: {
          styleJson: [
            {
              featureType: 'water',
              elementType: 'all',
              stylers: {
                color: '#044161'
              }
            },
            {
              featureType: 'land',
              elementType: 'all',
              stylers: {
                color: '#004981'
              }
            },
            {
              featureType: 'boundary',
              elementType: 'geometry',
              stylers: {
                color: '#064f85'
              }
            },
            {
              featureType: 'railway',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'highway',
              elementType: 'geometry',
              stylers: {
                color: '#004981'
              }
            },
            {
              featureType: 'highway',
              elementType: 'geometry.fill',
              stylers: {
                color: '#005b96',
                lightness: 1
              }
            },
            {
              featureType: 'highway',
              elementType: 'labels',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'arterial',
              elementType: 'geometry',
              stylers: {
                color: '#004981'
              }
            },
            {
              featureType: 'arterial',
              elementType: 'geometry.fill',
              stylers: {
                color: '#00508b'
              }
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'green',
              elementType: 'all',
              stylers: {
                color: '#056197',
                visibility: 'off'
              }
            },
            {
              featureType: 'subway',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'manmade',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'local',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'arterial',
              elementType: 'labels',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'boundary',
              elementType: 'geometry.fill',
              stylers: {
                color: '#029fd4'
              }
            },
            {
              featureType: 'building',
              elementType: 'all',
              stylers: {
                color: '#1a5787'
              }
            },
            {
              featureType: 'label',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            }
          ]
        }
      },
      geo:[
      ],
      series:[
        {

        }
      ]
    }
    midChart1.setOption(option)
  })

}

const midOption21 = ref({})
midOption21.value = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  color:'#C56183',
  grid: {
    top:'10%',
    left: '3%',
    right: '3%',
    bottom: '0%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: chartData.midOption2.cityList,
    axisLabel: {
      color:'white'
    }
  },
  yAxis: {
    type: 'value',
    splitLine:{
      show:false
    },
    interval:3,
    axisLabel: {
      color:'white'
    }
  },
  series: [
    {
      data: chartData.midOption2.value1,
      type: 'bar'
    }
  ]
};

const midOption22 = ref({})
midOption22.value = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  color:'#4FD3C4',
  grid: {
    top:'10%',
    left: '3%',
    right: '3%',
    bottom: '0%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: chartData.midOption2.cityList,
    axisLabel: {
      color:'white'
    }
  },
  yAxis: {
    type: 'value',
    splitLine:{
      show:false
    },
    interval:3,
    axisLabel: {
      color:'white'
    }
  },
  series: [
    {
      data: chartData.midOption2.value1,
      type: 'bar'
    }
  ]
};

const midOption23 = ref({})
midOption23.value = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  color:'#488FB1',
  grid: {
    top:'10%',
    left: '3%',
    right: '3%',
    bottom: '0%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: chartData.midOption2.cityList,
    axisLabel: {
      color:'white'
    }
  },
  yAxis: {
    type: 'value',
    splitLine:{
      show:false
    },
    interval:3,
    axisLabel: {
      color:'white'
    }
  },
  series: [
    {
      data: chartData.midOption2.value1,
      type: 'bar'
    }
  ]
};

const rightOption2 = ref({})
rightOption2.value = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  color:themeColor,
  legend: {
    data: chartData.rightOption2.legend,
    textStyle:{
      color:'#fff'
    },
    top:'10%'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: chartData.rightOption2.type,
      axisLabel:{
        color:'#fff'
      },
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel:{
        color:'#fff'
      },
      splitLine:{
        lineStyle:{
          color:'gray'
        }
      }
    }
  ],
  series: [
    {
      name: chartData.rightOption2.legend[0],
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: chartData.rightOption2.data[0]
    },
    {
      name: chartData.rightOption2.legend[1],
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: chartData.rightOption2.data[1]
    },
    {
      name: chartData.rightOption2.legend[2],
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: chartData.rightOption2.data[2]
    },
  ]
};

const dataSH = [
  [1, 81],
  [2, 55],
  [3, 57],
  [4, 76],
  [5, 84],
  [6, 68],
];
const dataNJ = [
  [1, 86],
  [2, 51],
  [3, 60],
  [4, 80],
  [5, 96],
  [6, 72],
];
const dataHZ = [
  [1, 68],
  [2, 48],
  [3, 56],
  [4, 75],
  [5, 83],
  [6, 56],
];
const dataHF = [
  [1, 90],
  [2, 55],
  [3, 62],
  [4, 71],
  [5, 84],
  [6, 58],
];

const schema = [
  { name: 'date', index: 0, text: '日' },
  { name: 'AQIindex', index: 1, text: 'AQI指数' },
];
const itemStyle = {
  opacity: 0.8,
  shadowBlur: 10,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: 'rgba(0,0,0,0.3)'
};
const rightOption3 = ref({})
rightOption3.value = {
  color: themeColor,
  grid: {
    left: '10%',
    right: '10%',
    top: '25%',
    bottom: '10%'
  },
  legend: {
    top: '10%',
    right:'5%',
    data: ['上海市', '南京市', '杭州市','合肥市'],
    textStyle: {
      fontSize: 12,
      color:'#fff'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    formatter: function (param) {
      var value = param.value;
      // prettier-ignore
      return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
          + param.seriesName + ' ' + value[0] + '月：'
          + '</div>'
          + schema[1].text + '：' + value[1] + '<br>';
    }
  },
  xAxis: {
    type: 'value',
    name: '月份',
    nameGap: 16,
    nameTextStyle: {
      fontSize: 16
    },
    max: 6,
    splitLine: {
      show: false
    },
    axisLabel:{
      color:'#fff'
    }
  },
  yAxis: {
    type: 'value',
    name: 'AQI指数',
    nameLocation: 'end',
    nameGap: 20,
    min:40,
    max:100,
    nameTextStyle: {
      fontSize: 16,
      color:'#fff'
    },
    splitLine: {
      show: false
    },
    axisLabel:{
      color:'#fff'
    }
  },
  series: [
    {
      name: '上海市',
      type: 'scatter',
      itemStyle: itemStyle,
      data: dataSH
    },
    {
      name: '南京市',
      type: 'scatter',
      itemStyle: itemStyle,
      data: dataNJ
    }, {
      name: '杭州市',
      type: 'scatter',
      itemStyle: itemStyle,
      data: dataHZ
    },{
      name: '合肥市',
      type: 'scatter',
      itemStyle: itemStyle,
      data: dataHF
    },
  ]
};
</script>

<style scoped>
.covid19Page{
  background-color: #000c3b;
  color: white;
  padding-right: 20px;
  padding-left: 20px;
  overflow: hidden;
}
.cov-title{
  justify-content: center;
  height: 10vh;
  align-items: center;
}
.font-title{
  background: linear-gradient(184deg, #fdfdfd 0%, #1face6 100%);
  -webkit-background-clip: text;
  font-size: 2.5em;
  color: transparent;
  margin-right: 10px;
  margin-left: 10px;
}
.box-title{
  position: absolute;
  top:-15px;
  height:30px;
  background: linear-gradient(184deg, #97e0e0 0%, #1face6 100%);
  -webkit-background-clip: text;
  color: transparent;
}
.box-title-text{
  margin: 0px 10px;
}
.in-out-image{
  width: 40%;
  text-align: center;
}
.marginBox{
  margin-bottom: 15px;
  margin-left: 15px;
}
.left1{
  height: 30vh;
}
.left2{
  height: 25vh;
}
.left3{
  height: 23vh;
  margin-left: 15px;
}
.mid1{
  height: 50vh;
}
.mid2{
  margin-left: 15px;
  height: 30vh;
}
.right1{
  height: 30vh;
}
.right2{
  height: 25vh;
}
.right3{
  height: 23vh;
}
</style>
