<template>
  <div class="rainForecast-back">

    <!--    标题-->
    <div class="flex-row-center" style="height: 75px;">
      <!--      <h2 style="color: white"></h2>-->
      <dv-decoration-3 style="width:250px;height:40px;"/>
      <dv-decoration-11 style="width:400px;height:75px;color: white"><h1>王家坝流域降雨预报专题</h1></dv-decoration-11>
      <dv-decoration-3 style="width:250px;height:40px;"/>

    </div>

    <!--    内容-->
    <div class="content-container flex-row-evenly">
      <div class="content-col-1 flex-Column-Around-Center">
        <!--降雨排行图-->
        <div class="part border-box ">
          <div id="rainRank" style="  width: 100%;  height: 100%;z-index: 5"></div>
        </div>

        <div class="part border-box ">
          <div id="lineChart" style="  width: 100%;  height: 100%;z-index: 5"></div>
        </div>
      </div>

      <div class="content-col-2 flex-Column-Around-Center">

        <!--地图-->`
        <div class="part border-box">
          <div id="map" style=" z-index: 5"></div>
          <div class="dateForestShow" style=" z-index: 5"><h1>{{ dateForest }}</h1></div>
          <div class="rainfallforcast-color" style=" z-index: 5">
            <div class="color-bar">
              <div class="color">
                <div class="color-item" style="background-color: #ffffff"></div>
                <div class="color-item" style="background-color: #9cf790"></div>
                <div class="color-item" style="background-color: #37a600"></div>
                <div class="color-item" style="background-color: #67b4f8"></div>
                <div class="color-item" style="background-color: #0002fe"></div>
                <div class="color-item" style="background-color: #fa03f0"></div>
                <div class="color-item" style="background-color: #710100"></div>
              </div>
              <div class="label">
                <div class="color-item" style="text-align: right">0</div>
                <div class="color-item" style="text-align: right">5</div>
                <div class="color-item" style="text-align: right">10</div>
                <div class="color-item" style="text-align: right">15</div>
                <div class="color-item" style="text-align: right">20</div>
                <div class="color-item" style="text-align: right">25</div>
                <div class="color-item" style="text-align: right"></div>
              </div>
            </div>
          </div>
        </div>

        <!--地图2-->
        <div class="part border-box">
          <div id="map2" style=" z-index: 5"></div>
          <div class="dateForestShow" style=" z-index: 5"><h1>{{ dateForest }}</h1></div>
        </div>
      </div>

      <div class="content-col-3 flex-Column-Around-Center">
        <div class="part border-box ">
          <!--          <div id="barChart" style="  width: 100%;  height: 100%;z-index: 5"></div>-->
          <div style="    width: 100%;    height: 100%;display: flex;    justify-content: center;">
            <h3 style=" color: #ffffff;position: absolute;    margin-top: -2px;">历史洪灾</h3>
            <img class="img" src="/case/rainForecast/historyRecord1.png" style="height: 100%;width: 100%">
          </div>
        </div>
        <div class="part border-box ">
          <div id="pieChart" style="  width: 100%;  height: 100%;z-index: 5"></div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language'
//此处在mapboxview里已经设置过，不能多次设置
// mapboxgl.setRTLTextPlugin("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js");

import * as echarts from "echarts";
import axios from "axios";

var map = null
var map2 = null

var rainRankChart;
var lineChart;
var pieChart;
var barChart;

export default {
  data() {
    return {
      dayCount: 0,
      dateForest: "2017-04-03"
    }
  },

  mounted() {

    this.initMap()
    this.initMap2()

    this.getSortRainfallByDistrict()
    this.getDailyRainfallByDistrict()

    this.createPieChart()
    // this.createBarChart()

    this.autoChange()
    this.clearSomething()


  },

  methods: {

    initMap() {
      mapboxgl.accessToken =
          "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [114.1, 32.5],
        // center:[-75.789, 41.874],
        zoom: 6.5,
      });
      map.addControl(new MapboxLanguage({defaultLanguage: "zh-Hans"}));


      map.on('load', function () {
        map.addSource("rainImgSource", {
              "type": "image",
              "url": "/case/rainForecast/temp_rain_imgs/2017-04-03-0.png",
              "coordinates": [
                [113.25, 33.55],
                [115.65, 33.55],
                [115.65, 31.45],
                [113.25, 31.45]
              ]
            }
        )
        map.addLayer({
          "id": "rainImgLayer",
          "source": "rainImgSource",
          "type": "raster",
          "paint": {"raster-opacity": 0.85}
        });


        // map.addSource("rainStationSource", {
        //       "type": "geojson",
        //       "data": "/case/rainForecast/output.json"
        //     }
        // )
        // map.addLayer({
        //   "id": "rainStationLayer",
        //   "source": "rainStationSource",
        //   "type": "circle",
        //   'paint': {
        //     'circle-radius': 2,
        //     'circle-color': 'rgba(55,148,179,1)'
        //   },
        // });


      });
    },

    initMap2() {
      map2 = new mapboxgl.Map({
        container: "map2",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [114.1, 32.5],
        // center:[-75.789, 41.874],
        zoom: 6.5,
      });
      // map2.addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }));

      map2.on('load', function () {
        map2.addSource("rainStationSource", {
              "type": "geojson",
              "data": "/case/rainForecast/output.json"
            }
        )

        // map2.addLayer({
        //   "id": "rainStationLayer2",
        //   "source": "rainStationSource",
        //   "type": "circle",
        //   'paint': {
        //     'circle-radius': 20,
        //     'circle-color': 'rgba(55,148,179,1)'
        //   },
        // });


        map2.loadImage('/case/rainForecast/station.png', function (error, image) {
          if (error) throw error;
          map2.addImage('station', image);
          map2.addLayer({
            "id": "rainStationLayer",
            "source": "rainStationSource",
            "type": "symbol",
            "layout": {
              "icon-image": "station",
              "text-field": "{ranData0}",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 0.6],
              "text-anchor": "top",
              "icon-size": 0.1
            },
            filter: ['>', 'ranData0', 0]
          });
        });

      });
    },
    changeRainDay() {

      map.removeLayer("rainImgLayer");
      map.removeSource("rainImgSource");

      this.dayCount = (this.dayCount + 1) % 7
      let imgUrl = "/case/rainForecast/temp_rain_imgs/2017-04-03-" + this.dayCount + ".png"

      map.addSource("rainImgSource", {
        "type": "image",
        "url": imgUrl,
        "coordinates": [
          [113.25, 33.55],
          [115.65, 33.55],
          [115.65, 31.45],
          [113.25, 31.45]
        ]
      })
      map.addLayer({
        "id": "rainImgLayer",
        "source": "rainImgSource",
        "type": "raster",
        "paint": {"raster-opacity": 0.85}
      });

      let randData = "{ranData" + this.dayCount + "}"
      map2.setLayoutProperty("rainStationLayer", "text-field", randData);

      let ranDatath = "ranData" + this.dayCount
      map2.setFilter('rainStationLayer', ['>', ranDatath, 0]);

      let tempCount = 3 + this.dayCount
      this.dateForest = "2017-4-" + tempCount

    },
    autoChange() {
      setInterval(() => {
        this.changeRainDay()
      }, 2000)
    },

    //清除
    clearSomething() {
      document.getElementsByClassName("mapboxgl-ctrl-bottom-left")[0].remove()
      document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove()
      document.getElementsByClassName("mapboxgl-ctrl-bottom-left")[0].remove()
      document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove()
    },

    //降雨地区排行数据获取
    getSortRainfallByDistrict() {
      axios
          .post("http://172.21.212.63:8999/dashboard/sortRainfallByDistrict", {
            "count": 10,
            "isAsc": -1
          })
          .then((res) => {
            let data = res.data.data
            let name = []
            let rain = []
            data.forEach((item, index, array) => {
              Object.keys(item).forEach(key => {
                name.unshift(key)
                rain.unshift(item[key])
              })
            })
            this.createRainRankChart(name, rain)
          });
    },
    //降雨地区排行绘图
    createRainRankChart(name, rain) {

      if (rainRankChart != null && rainRankChart != "" && rainRankChart != undefined) {
        rainRankChart.dispose();//销毁
      }

      rainRankChart = echarts.init(document.getElementById('rainRank'), "dark");

      let option;

      const colors = ['#f00', '#ffde00', "#0000FF", "#008000", "#FFA500", "#00FFFF", "#7FFFD4", "#FFE4C4", "#5F9EA0", "#B8860B"];

      option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {},
        yAxis: {type: 'category', data: name},
        title: [
          {
            text: '周地区降雨排行图(mm)',
            left: 'center',
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        series: [
          {
            type: 'bar',
            encode: {
              x: 'amount',
              y: 'product'
            },
            data: rain,
            label: {
              show: true,
              // 标签的文字。
              formatter: function (param) {
                return param.data[1];
              },
              position: 'right',
            },
            itemStyle: {
              color: function (param) {
                return colors[param.dataIndex] || '#5470c6';
              }
            }
          }
        ]
      };

      option && rainRankChart.setOption(option);
    },

    //部分地区降雨预测数据获取
    getDailyRainfallByDistrict() {
      axios
          .post("http://172.21.212.63:8999/dashboard/getDailyRainfallByDistrict", {
            "count": 10,
            "isAsc": -1
          })
          .then((res) => {
            let rainData = res.data.data
            let name = []
            Object.keys(rainData).forEach(key => {
              name.push(key)
            })

            this.createLineChart(name, rainData)
          });
    },
    //部分地区降雨预测绘图
    createLineChart(name, rainData) {

      if (lineChart != null && lineChart != "" && lineChart != undefined) {
        lineChart.dispose();//销毁
      }
      lineChart = echarts.init(document.getElementById('lineChart'), "dark");
      let option;

      option = {
        title: {
          text: '部分地区降雨预测趋势图(mm)',
          left: "center"
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
          data: name,
          bottom: 20,
        },
        grid: {
          left: '8%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // data: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7']
            data: ['4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: name[0],
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            label: {
              position: 'right',
              show: true
            },
            data: rainData[name[0]]
          },
          {
            name: name[1],
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            label: {
              position: 'right',
              show: true
            },
            data: rainData[name[1]]
          },
          {
            name: name[2],
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            label: {
              position: 'right',
              show: true
            },
            data: rainData[name[2]]
          },
          {
            name: name[3],
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            label: {
              position: 'right',
              show: true
            },
            data: rainData[name[3]]
          },
          {
            name: name[4],
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            label: {
              position: 'right',
              show: true
            },
            data: rainData[name[4]]
          },

        ]
      };

      option && lineChart.setOption(option);

    },


    //历史降雨饼状图
    createPieChart() {

      if (pieChart != null && pieChart != "" && pieChart != undefined) {
        pieChart.dispose();//销毁
      }
      pieChart = echarts.init(document.getElementById('pieChart'), "dark");
      let option;

      option = {
        title: {
          text: '月历史降雨统计(mm)',
          left: "center"
        },
        legend: {
          top: 'bottom'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [20, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              formatter: function (param) {
                return param.data["name"] + ":" + param.data["value"];
              },
              show: true
            },
            data: [
              {value: 40, name: '罗山县'},
              {value: 38, name: '汝南县'},
              {value: 32, name: '平桥区'},
              {value: 30, name: '正阳区'},
              {value: 28, name: '新县'},
              {value: 26, name: '驿城区'},
              {value: 22, name: '浉河区'}
            ]
          }
        ]
      };

      option && pieChart.setOption(option);
    },

    /*createBarChart() {*/

    /*  if (barChart != null && barChart != "" && barChart != undefined) {*/
    /*    barChart.dispose();//销毁*/
    /*  }*/
    /*  barChart = echarts.init(document.getElementById('barChart'), "dark");*/
    /*  let option;*/

    /*  option = {*/
    /*    title: {*/
    /*      text: '历史暴雨事件',*/
    /*      left: "center"*/
    /*    },*/
    /*    tooltip: {*/
    /*      trigger: 'axis',*/
    /*      axisPointer: {*/
    /*        type: 'shadow'*/
    /*      }*/
    /*    },*/
    /*    legend: {*/
    /*      top: 'bottom'*/
    /*    },*/
    /*    grid: {*/
    /*      left: '3%',*/
    /*      right: '4%',*/
    /*      bottom: '3%',*/
    /*      containLabel: true*/
    /*    },*/
    /*    xAxis: {*/
    /*      type: 'value',*/
    /*      boundaryGap: [0, 0.01]*/
    /*    },*/
    /*    yAxis: {*/
    /*      type: 'category',*/
    /*      data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']*/
    /*    },*/
    /*    series: [*/
    /*      {*/
    /*        name: '2011',*/
    /*        type: 'bar',*/
    /*        data: [18203, 23489, 29034, 104970, 131744, 630230]*/
    //       },
    //       {
    //         name: '2012',
    //         type: 'bar',
    //         data: [19325, 23438, 31000, 121594, 134141, 681807]
    //       }
    //     ]
    //   };
    //
    //   option && barChart.setOption(option);
    // }

  }

}

</script>

<style scoped>

.rainForecast-back {
  background-image: url("../../assets/img/rainForecast_back.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100% !important;
}

.flex-row-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-row-evenly {
  display: flex;
  justify-content: space-evenly;
}

.flex-Column-Around-Center {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.content-container {
  height: calc(100% - 75px);
  width: 100%;
}

.content-col-1 {
  /*height: calc(100vh - 60px);*/
  height: 100%;
  width: 30%;
}

.content-col-2 {
  /*height: calc(100vh - 60px);*/
  height: 100%;
  width: 40%;
}

.content-col-3 {
  /*height: calc(100vh - 60px);*/
  height: 100%;
  width: 30%;
}

.part {
  width: 90%;
  height: 40%;
  padding: 20px;
  position: relative;
  box-shadow: rgb(0 108 255) 0px 0px 25px inset;
}

.partBig{
  width: 90%;
  height: 90%;
  padding: 20px;
  position: relative;
  box-shadow: rgb(0 108 255) 0px 0px 25px inset;
}


#map {
  width: 100%;
  height: 100%;
}

#map2 {
  width: 100%;
  height: 100%;
}

.rainfallforcast-color {
  width: fit-content;
  height: 40px;
  padding: 5px 15px;
  z-index: 9;
  position: absolute;
  bottom: 20px;
  left: 20px;

  display: flex;
  align-items: center;
  background-color: rgba(124, 120, 120, 0.2);
  border-radius: 5px;
  /* box-shadow: 2px 2px 2px #aaa; */
  opacity: 0.9;
  color: #b9b8ce;
}

.rainfallforcast-color .color-bar {
  display: flex;
  height: fit-content;
  flex-direction: column;
  /* background-color: red; */
}

.rainfallforcast-color .color-bar .color {
  width: fit-content;
  height: fit-content;
  display: flex;
}

.rainfallforcast-color .color-bar .label {
  display: flex;
  height: fit-content;
  width: fit-content;
  font-size: 12px;
}

.rainfallforcast-color .color-bar .color-item {
  width: 36px;
  height: 12px;
}

.dateForestShow {
  color: #ff003b;
  position: absolute;
  top: 20px;
  right: 30px;
}

.border-box {
  position: relative;
  background: rgba(1, 19, 67, 0.8);
  border: 2px solid #00a1ff;
  border-radius: 8px;
}

.border-box::before {
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: 30px;
  width: calc(100% - 60px);
  content: "";
  border-top: 2px solid #016886;
  border-bottom: 2px solid #016886;
  z-index: 0;
}

.border-box::after {
  position: absolute;
  top: 30px;
  right: -2px;
  left: -2px;
  height: calc(100% - 60px);
  content: "";
  border-right: 2px solid #016886;
  border-left: 2px solid #016886;
  z-index: 0;
}

/*.border-box p{*/
/*  line-height:100px;*/
/*  text-align: center;*/
/*  color:#00a1ff;*/
/*}*/

</style>