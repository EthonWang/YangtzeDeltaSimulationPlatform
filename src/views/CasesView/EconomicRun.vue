<template>
  <el-row class="economicPage">
    <el-col :span="8">
      <div class="box-left left1">
        <dv-border-box1 >
          <dv-decoration-7 class="box-title"><h3 class="box-title-text">地区生产总值</h3></dv-decoration-7>
            <el-button-group  size="small" style="position: absolute;right: 5%">
              <el-button >GDP</el-button>
              <el-button >第一产业</el-button>
              <el-button >第二产业</el-button>
              <el-button >第三产业</el-button>
            </el-button-group>
          <chart-case id="leftChart1" :option="leftChartOption1" :style="chartStyle"></chart-case>
          <span class="note-info">*数据来源于各省市统计局,<br>时间为2021年前三季度</span>
        </dv-border-box1>
      </div>
      <div class="box-left left2">
        <dv-border-box1 >
          <dv-decoration-7 class="box-title"><h3 class="box-title-text">固定资产投资增长比</h3></dv-decoration-7>
          <chart-case id="leftChart2" :option="leftChartOption2" :style="chartStyle"></chart-case>
          <span class="note-info">数据来源于各省市统计局,<br>时间为2021年前三季度</span>
        </dv-border-box1>
      </div>
      <div class="box-left left3">
        <dv-border-box1 >
          <dv-decoration-7 class="box-title"><h3 class="box-title-text">财政预算</h3></dv-decoration-7>
          <chart-case id="leftChart3" :option="leftChartOption3" :style="chartStyle"></chart-case>
          <span class="note-info">数据来源于各省市统计局,<br>时间为2021年前三季度</span>
        </dv-border-box1>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="box-mid mid1"><h1>长三角经济运行专题</h1></div>
      <div class="box-mid mid2">
        <dv-decoration-5 :dur="3" style="width:100%;height:40px;" />
      </div>
      <div class="box-mid mid3">
        <dv-border-box1>
          <el-row>
            <template v-for="(item,key) in chartData.midData1" :key="key">
              <el-col :span="8" style="display: flex;flex-direction: column;align-items: center;margin-top: 30px">
                <h3>{{item.name+"("+item.unit+")"}}</h3>
                <h1 style="color:#4786d4 ">{{item.value}}</h1>
              </el-col>
            </template>
          </el-row>
          <div style="width: 100%;height: 100%;display: flex">
            <chart-case id="midChart1" :option="midChartOption1" style="width: 40%;height: 95%;"></chart-case>
            <chart-case id="midChart2" :option="midChartOption2" :style="chartStyle"></chart-case>
            <span class="note-info">*本数据来源于各省市统计局，时间为2020年</span>
          </div>
        </dv-border-box1>
      </div>
      <div class="box-mid mid4">
        <dv-border-box1>
          <div style="width: 100%;height: 30px;display: flex">
            <dv-decoration-7 class="box-title"><h3 class="box-title-text">人民生活</h3></dv-decoration-7>
          </div>
          <chart-case id="midChart3" :option="midChartOption3" :style="chartStyle"></chart-case>
          <span class="chartLegend" style="left: 10%;top: 20%">全体居民人均可<br>支配收入(元)</span>
          <span class="chartLegend" style="right: 5%;top: 12%">城镇居民人均可<br>支配收入(元)</span>
          <span class="chartLegend" style="right: 5%;top: 62%">农村居民人均可<br>支配收入(元)</span>
          <span class="note-info">*数据来源于各省市统计局,<br>时间为2021年前三季度</span>
        </dv-border-box1>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="box-right right1">
        <dv-border-box1 >
          <dv-decoration-7 class="box-title"><h3 class="box-title-text">GDP"万亿俱乐部"</h3></dv-decoration-7>
          <div id="rightChart1" :style="chartStyle"></div>
        </dv-border-box1>
      </div>
      <div class="box-right right2">
        <dv-border-box1 >
          <dv-decoration-7 class="box-title"><h3 class="box-title-text">GDP城市排行</h3></dv-decoration-7>
          <div style="width: 100%;height: 95%;display: flex">
            <chart-case id="rightChart2" :option="rightChartOption2" :style="chartStyle"></chart-case>
            <chart-case id="rightChart3" :option="rightChartOption3" :style="chartStyle"></chart-case>
          </div>
          <span class="note-info">数据来源于各省市统计局,时间为2021年前三季度</span>
        </dv-border-box1>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import ChartCase from "components/Cases/chartCase";
import "echarts/extension/bmap/bmap";

const buttonType = ref(['','info','info','info'])
const GDPClick = ()=>{
  buttonType.value[0] = ''
}
const chartStyle = ref({})
chartStyle.value = {
  width: "100%",
  height: "95%",
  padding: 0,
}
const chartData = {
  color:['#55b2e5','#7de6c0','#646c92'],
  placeList:['上海市', '江苏省', '浙江省', '安徽省'],
  leftChart1:{
    time:['第1季度', '第1-2季度', '第1-3季度'],
    unit:"单位:亿元",
    time1:[9458.86, 25878.38, 16347.0, 9529.1],
    time2:[20102.53, 55199.63, 34556.0, 20576.5],
    time3:[30866.73, 84895.7, 52853.0, 31874.8],
  },
  leftChart2:{
    time:['第1季度', '第1-2季度', '第1-3季度'],
    unit:"固定资产投资比去年同期增长比(%)",
    time1:[27.1, 22.1, 21.8, 25.7],
    time2:[10.9, 10.3, 14.9, 11.4],
    time3:[9.4, 6.7, 13.1, 10.4],
  },
  leftChart3:{
    time:['第1季度', '第1-2季度', '第1-3季度'],
    unit:"一般公共预算收入(亿元)",
    time1:[2270.31, 2776.1, 2757.0, 945.2],
    time2:[4731.51, 5647.0, 5314.0, 1956.3],
    time3:[6479.18, 7811.4, 7226.0, 2809.4],
  },
  midData1:[
    {
      name:'社会消费品零售总额',
      unit:"亿元",
      value:'97982'
    },{
      name:'进出口总额',
      unit: "亿元",
      value:'118139'
    },{
      name:'地区生产总值',
      unit: "亿元",
      value:'244713'
    },
  ],
  midData3:{
    time:['第1季度', '第1-2季度', '第1-3季度'],
    allResident: {
      time1:[21548, 15500, 18263, 8893],
      time2:[40357, 25119, 30998, 15969],
      time3:[58907, 36227, 44712, 23361],
    },
    cityResident: {
      time1:[22636, 18194, 21600, 12104],
      time2:[42348, 30491, 36294, 21837],
      time3:[61915, 44267, 52758, 32603],
    },
    countyResident: {
      time1:[12006, 10215, 11686, 5674],
      time2:[22535, 14455, 20357, 10010],
      time3:[31985, 20267, 28474, 13988],
    },
  },
  rightChart1:{
    pointData:[
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
    ],
    coorData:{
      南京市:[118.803129,32.065761],
      南通市:[120.901068,31.986888],
      无锡市:[120.318628,31.497438],
      苏州市:[120.591682,31.305976],
      上海市:[121.480248,31.236276],
      杭州市:[120.216481,30.251863],
      宁波市:[121.630925,29.866002],
      合肥市:[117.233674,31.826972],
      常州市:[119.980563,31.817432],
      泰州市:[119.929529,32.462353],
      扬州市:[119.419251,32.400703],
      盐城市:[120.169177,33.353942],
      徐州市:[117.290313,34.209974],
      嘉兴市:[120.762189,30.752582],
      绍兴市:[120.590041,30.057623],
      台州市:[121.427506,28.662316],
      温州市:[120.705764,28.000064],
    }
  },
  rightChart2:{
    title:"2021年前3季度GDP前十城市",
    city:['徐州市','常州市','合肥市','南通市','无锡市','宁波市','南京市','杭州市', '苏州市','上海市'],
    value:[5962,6188,8207,8346,10029,10333,11907,13151,16393,30867],
  },
  rightChart3:{
    title:"2021年前3季度GDP增速前十城市",
    city:[
      "湖州市",
      "泰州市",
      "淮安市",
      "金华市",
      "宣城市",
      "滁州市",
      "池州市",
      "六安市",
      "亳州市",
      "芜湖市"
    ],
    value:[
      11.8,
      11.9,
      12,
      12.1,
      12.3,
      12.3,
      12.4,
      12.6,
      12.6,13.6
    ],
  }
}
const leftChartOption1 = ref({})
leftChartOption1.value = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  grid: {
    top:'15%',
    left: '3%',
    right: '5%',
    bottom: '23%',
    containLabel: true
  },
  color:chartData.color,
  legend: {
    bottom:"10%",
    data: chartData.leftChart1.time
  },
  xAxis: [
    {
      type: 'category',
      data: chartData.placeList,
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: {
    type: 'value',
    name:  chartData.leftChart1.unit,
  },
  series: [
    {
      name: chartData.leftChart1.time[0],
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value;
        }
      },
      data:  chartData.leftChart1.time1
    },
    {
      name: chartData.leftChart1.time[1],
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value;
        }
      },
      data: chartData.leftChart1.time2
    },
    {
      name: chartData.leftChart1.time[2],
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value;
        }
      },
      data: chartData.leftChart1.time3
    },
  ]
};

const leftChartOption2 = ref({})
leftChartOption2.value =  {
  title: {
    text: chartData.leftChart2.unit,
    right:'10%',
    textStyle:{
      fontSize:'0.8em',
      color:'gray'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    bottom:"10%",
    data: chartData.leftChart1.time
  },
  color:chartData.color,
  grid: {
    top:'12%',
    left: '3%',
    right: '5%',
    bottom: '23%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: chartData.placeList
    }
  ],
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name:chartData.leftChart2.time[0],
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftChart2.time1
    },
    {
      name: chartData.leftChart2.time[1],
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftChart2.time2
    },
    {
      name: chartData.leftChart2.time[2],
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: chartData.leftChart2.time3
    },
  ]
};

const leftChartOption3 = ref({})
leftChartOption3.value = {
  title: {
    text: chartData.leftChart3.unit,
    right:'10%',
    textStyle:{
      fontSize:'0.8em',
      color:'gray'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  grid: {
    top:'0%',
    left: '3%',
    right: '5%',
    bottom: '23%',
    containLabel: true
  },
  color:chartData.color,
  legend: {
    bottom:"10%",
    data: chartData.leftChart3.time
  },
  xAxis: {
    type: 'value',
  },
  yAxis: [
    {
      type: 'category',
      data: chartData.placeList,
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  series: [
    {
      name: chartData.leftChart3.time[0],
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value;
        }
      },
      data:  chartData.leftChart3.time1
    },
    {
      name: chartData.leftChart3.time[1],
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value;
        }
      },
      data: chartData.leftChart3.time2
    },
    {
      name: chartData.leftChart3.time[2],
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value;
        }
      },
      data: chartData.leftChart3.time3
    },
  ]
};

const midChartOption1 = ref({})
midChartOption1.value = {
  tooltip: {},
  color:chartData.color,
  grid: {
    top:'0%',
    left: '3%',
    right: '5%',
    bottom: '23%',
    containLabel: true
  },
  series: [
    {
      type: 'pie',
      radius: ['70%'],
      center: ['50%', '33%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'inside'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 58.6, name: '出口总额占比' },
        { value: 41.4, name: '进口总额占比' },
      ]
    }
  ]
};

const midChartOption2 = ref({})
midChartOption2.value = {
  tooltip: {
    trigger: 'item',
    formatter:'{c}%'
  },
  color:chartData.color,
  series: [
    {
      type: 'pie',
      radius: '50%',
      center: ['50%', '33%'],
      label:{
        show:true,
      },
      data: [
        { value: 4.08, name: '第一产业增加值占比' },
        { value: 39.48, name: '第二产业增加值占比' },
        { value: 56.44, name: '第三产业增加值占比' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

const midChartOption3 = ref({})
let indicator = [
  { text: chartData.placeList[0], max: 70000 },
  { text: chartData.placeList[1], max: 70000 },
  { text: chartData.placeList[2], max: 70000 },
  { text: chartData.placeList[3], max: 70000 }
]
let splitArea = {
  areaStyle: {
    color: chartData.color,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowBlur: 10
  }
}
midChartOption3.value = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    bottom:"5%",
    left:"10%",
    data: chartData.midData3.time
  },
  radar: [
    {
      indicator: indicator,
      center: ['32%', '50%'],
      splitArea: splitArea,
      radius: 140
    },
    {
      indicator: indicator,
      radius: 80,
      center: ['70%', '25%'],
      splitArea: splitArea,
    },
    {
      indicator: indicator,
      center: ['70%', '75%'],
      radius: 80,
      splitArea: splitArea,
    }
  ],
  series: [
    {
      type: 'radar',
      tooltip: {
        trigger: 'item'
      },
      name:"全体居民人均可支配收入",
      color:['#e8d700','#e59d00','#e37400'],
      symbolSize:8,
      data: [
        {
          value: chartData.midData3.allResident.time1,
          name: chartData.midData3.time[0],
        },{
          value: chartData.midData3.allResident.time2,
          name: chartData.midData3.time[1],
        },{
          value: chartData.midData3.allResident.time3,
          name: chartData.midData3.time[2],
        },
      ]
    },
    {
      type: 'radar',
      radarIndex: 1,
      tooltip: {
        trigger: 'item'
      },
      symbolSize:6,
      data: [
        {
          value: chartData.midData3.cityResident.time1,
          name: chartData.midData3.time[0]
        },{
          value: chartData.midData3.cityResident.time2,
          name: chartData.midData3.time[1]
        },{
          value: chartData.midData3.cityResident.time3,
          name: chartData.midData3.time[2]
        },
      ]
    },
    {
      type: 'radar',
      radarIndex: 2,
      tooltip: {
        trigger: 'item'
      },
      symbolSize:6,
      data: [
        {
          value: chartData.midData3.countyResident.time1,
          name: chartData.midData3.time[0]
        },{
          value: chartData.midData3.countyResident.time2,
          name: chartData.midData3.time[1]
        },{
          value: chartData.midData3.countyResident.time3,
          name: chartData.midData3.time[2]
        },
      ]
    }
  ]
};

const rightChartOption1 = ref({})


const getJsonData = () => {
  let mapEcharts = echarts.init(document.getElementById('rightChart1'))
  fetch('../../../public/case/economicRun/cityArea.geojson').then(res=>{
    return res.json()
  }).then(cityArea=>{
    echarts.registerMap('cityArea',cityArea)
    rightChartOption1.value = {
      visualMap: {
        top:'5%',
        right:'5%',
        type: "piecewise",
        show:true,
        min: -1,
        max: 2,
        splitNumber: 3,
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#e0e4e7','#7de6c0','#646c92']
        },
        formatter:function (value,value2){
          if(value == 0){
            return "GDP在5000亿-1万亿元以上的城市";
          }else if(value == 1){
            return "GDP在1万亿元以上的城市";
          }else {
            return "GDP在5000亿元以下的城市";
          }
        }
      },
      series: [
        {
          name: '市级边界',
          type: 'map',
          map: 'cityArea',
          center: [118.81893, 31.40936],
          z:2,
          data:chartData.rightChart1.pointData,
        }
      ]
    }
    mapEcharts.setOption(rightChartOption1.value)
  });
}
onMounted(()=>{
  getJsonData()
})

const rightChartOption2 = ref({})
rightChartOption2.value = {
  title:{
    text:chartData.rightChart2.title,
    top:0,
    left:'center',
    textStyle:{
      fontSize:'14'
    }
  },
  color:'#64afe9',
  grid: {
    top:'8%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    axisLabel:{
      show:false
    },
    splitLine:{
      show:false
    }
  },
  yAxis: {
    type: 'category',
    data: chartData.rightChart2.city,
    splitLine:{
      show:false
    }
  },
  series: [
    {
      data:chartData.rightChart2.value,
      type: 'bar',
      label:{
        show:true,
        position:'inside',
        color:"#fff",
      }
    }
  ]
};

const rightChartOption3 = ref({})

const chartRightData3 = ()=>{
  let city = []
  for (let i = chartData.rightChart3.value.length;i>0;i--){
    city.push(chartData.rightChart3.value[i-1])
  }
  let data = []
  chartData.rightChart3.value.map(item=>{
    data.push({
      value:item,
      symbolRepeat: false,
      symbolSize: [42, 32]
    })
  })
  return data;
}
chartRightData3()
rightChartOption3.value = {
  title:{
    text:chartData.rightChart2.title,
    top:0,
    left:'center',
    textStyle:{
      fontSize:'14'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top:'8%',
    left: '30%',
    right: '5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    splitLine: { show: false },
    axisLine: { show: false },
    axisLabel: { show: false },
  },
  yAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      margin: 50,
      fontSize: 14,
      formatter: function (value, index) {
        return value;
      }
    },
    axisPointer: {
      label: {
        show: true,
        margin: 0,
      }
    },
    data: chartData.rightChart3.city
  },
  animationEasing: 'elasticOut',
  series: [
    {
      type: 'pictorialBar',
      symbol: 'circle',
      label:{
        show: true,
        position: 'inside',
        offset: [-26, 0],
        fontSize: 12,
        color:'white',
        formatter:'{c}%'
      },
      data: chartRightData3(),

    }
  ]
};

</script>

<style scoped>
.economicPage{
  padding-right: 20px;
  padding-left: 20px;
  align-items: center;
}
.chartLegend{
  position: absolute;
  color: #0c7dd8;
  font-size: 0.8em;
}
.box-title-text{
  margin: 0px 10px;
}
.note-info{
  position: absolute;
  right: 3%;
  bottom: 3%;
  font-size: 0.6em;
  color: gray;
}
.box-title{
  height:30px;
}
.left1{
  height: 29vh;
}
.left2{
  height: 30vh;
}
.left3{
  height: 30vh;
}
.box-mid{
  width: 100%;
  display: flex;
  justify-content: center;
}
.mid3{
  height: 30vh;
}
.mid4{
  height: 50vh;
}
.right1{
  height: 40vh;
}
.right2{
  height: 48vh;
}
</style>
