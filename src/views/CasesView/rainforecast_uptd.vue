<template>
  <div style="width: 100%; height: 100%" class="content">
    <div class="top">
      <div class="Info_card">
        <div class="Weather_card_box">
          <div class="Weather_card">
            <div class="location_and_time_box">
              <div class="location_box">江苏省 南京市</div>
              <div class="time_box">11月24日 农历十一月初一</div>
            </div>
            <div class="icon_temp">
              <div class="img_box">
                <img
                  width="100%"
                  height="80%"
                  title="多云"
                  src="https://assets.msn.cn/weathermapdata/1/static/svg/72/v6/card/MostlyCloudyNightV2.svg"
                />
              </div>
              <div class="temp">
                <div class="num">13</div>
                <div class="unit">°C</div>
              </div>
              <div class="weather_des">
                <div class="des">多云</div>
              </div>
            </div>
            <div class="brief_des">
              今天大部分地区多云。最高气温20°C，最低气温8°C。
            </div>
            <div class="other_index">
              <div class="wind_dir item">
                <div class="property">风向</div>
                <div class="data">东北风</div>
              </div>
              <div class="wind_level item">
                <div class="property">风速</div>
                <div class="data">2级</div>
              </div>
              <div class="humidity item">
                <div class="property">湿度</div>
                <div class="data">78%</div>
              </div>
              <div class="cloud item">
                <div class="property">云量</div>
                <div class="data">65%</div>
              </div>
              <div class="rain item">
                <div class="property">降雨量</div>
                <div class="data">80mm/h</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tips_card_box"></div>
      </div>
      <div class="title_map">
        <div class="title_box">
          <div class="title">
            <h1>长三角天气预报</h1>
          </div>
        </div>
        <div class="map_box">
          <div id="map"></div>
        </div>
      </div>
      <div class="rank_bar_box">
        <div class="rank_bar">
          <dv-scroll-board
            :config="config"
            style="width: 100%; height: 100%; border-radius: 10px"
          />
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="hours_weather">
        <div class="chart_box">
          <div id="chart"></div>
        </div>
      </div>
      <div class="days_weather"></div>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/request/request";
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import mapboxgl from "mapbox-gl";
// import { get, post } from "@/request/request";
// import axios from "axios";
// import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import * as echarts from "echarts";

var map = null;
export default {
  data() {
    return {
      config: {
        header: ["城市", "最高温度", "最低温度"],
        data: [
          ["南京市", "20°C", "8°C"],
          ["上海市", "25°C", "7°C"],
          ["杭州市", "27°C", "5°C"],
          ["宁波市", "22°C", "5°C"],
          ["苏州市", "23°C", "10°C"],
          ["芜湖市", "21°C", "4°C"],
          ["合肥市", "12°C", "-1°C"],
          ["温州市", "15°C", "18°C"],
          ["徐州市", "13°C", "16°C"],
          ["南通市", "10°C", "13°C"],
        ],
        // index: true,
        columnWidth: [200],
        align: ["center"],
        carousel: "page",
        rowNum: 8,
        headerBGC: "#4C47C3",
        oddRowBGC: "#0E1C4E",
        evenRowBGC: "#0A0D33",
        headerHeight: 45,
      },
    };
  },
  methods: {
    initMap() {
      //令牌
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
      //底图加载
      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/johnnyt/cl9mkdnso000q15rlcoxiaab0",
        center: [118, 32],
        zoom: 6,
      });
    },
    initchart() {
      var chartDom = document.getElementById("chart");
      var myChart = echarts.init(chartDom);
      var option;
      const data = [
        ["0:00", 10],
        ["1:00", 9],
        ["2:00", 7],
        ["3:00", 6],
        ["4:00", 3],
        ["5:00", 2],
        ["6:00", 5],
        ["7:00", 8],
        ["8:00", 10],
        ["9:00", 13],
        ["10:00", 15],
        ["11:00", 18],
        ["12:00", 20],
        ["13:00", 21],
        ["14:00", 24],
        ["15:00", 26],
        ["16:00", 20],
        ["17:00", 17],
        ["18:00", 13],
        ["19:00", 10],
        ["20:00", 8],
        ["21:00", 3],
        ["22:00", 0],
        ["23:00", -2],
        ["24:00", -4],
      ];
      const dateList = data.map(function (item) {
        return item[0];
      });
      const valueList = data.map(function (item) {
        return item[1];
      });
      // option = {
      //   // Make gradient line here
      //   visualMap: [
      //     {
      //       show: false,
      //       type: "continuous",
      //       seriesIndex: 0,
      //       max: 30,
      //       min: -5,
      //       inRange: {
      //         color: [
      //           "#624E6F",
      //           "#383965",
      //           "#3E5FE3",
      //           "#3EC1E3",
      //           "#3EE3A5",
      //           "#A0E33E",
      //           "#E38E3E",
      //           "#E3583E",
      //         ],
      //       },
      //     },
      //   ],
      //   title: [
      //     {
      //       // top: "0%",
      //       left: "center",
      //       text: "24小时天气概况",
      //     },
      //   ],
      //   // tooltip: {
      //   //   trigger: "axis",
      //   // },
      //   xAxis: [
      //     {
      //       data: dateList,
      //       gridIndex: 1,
      //       show: false,
      //     },
      //   ],
      //   yAxis: [
      //     {
      //       gridIndex: 1,
      //       show: false,
      //     },
      //   ],
      //   grid: [
      //     {
      //       // bottom: "0%",
      //     },
      //     {
      //       // top: "0%",
      //     },
      //   ],
      //   series: [
      //     {
      //       type: "line",
      //       showSymbol: false,
      //       data: valueList,
      //       smooth: true,
      //       xAxisIndex: 0,
      //       yAxisIndex: 0,
      //       areaStyle: {
      //         opacity: 0.3,
      //         // origin: "end",
      //         // shadowColor: "rgba(0, 0, 0, 0.5)",
      //         // number: 50,
      //       },
      //     },
      //   ],
      // };
      option = {
        visualMap: [
          {
            show: false,
            type: "continuous",
            seriesIndex: 0,
            max: 30,
            min: -5,
            inRange: {
              color: [
                "#624E6F",
                "#383965",
                "#3E5FE3",
                "#3EC1E3",
                "#3EE3A5",
                "#A0E33E",
                "#E38E3E",
                "#E3583E",
              ],
            },
          },
        ],
        xAxis: {
          type: "category",
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            data: data,
            type: "line",
            label: {
              formatter: function (param) {
                // return param.data["year"] + ":" + param.data["value"];
                return param.data[1] + "°C";
              },
              show: true,
            },
            smooth: true,
            // showAllSymbol: true,
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
  computed: {
    // ...mapState("weather", [
    //   "weather",
    //   "RAIN",
    //   "TEMP",
    //   "DD",
    //   "FF",
    //   "STATION",
    //   "RH",
    //   "TEMP_MAX",
    //   "TEMP_MIN",
    // ]),
    // ...mapGetters("weather", ["Weather"]),
  },
  created() {
    // this.$store.dispatch(
    //   "weather/getweatherInfo",
    //   "nanjing_nnu",
    //   "jPUN2KxMOeYrbdQB",
    //   "2022112380000"
    // );
  },
  mounted() {
    this.initMap();
    this.initchart();
  },
};
</script>

<style lang="less" scoped>
.content {
  background: linear-gradient(180deg, #244d72 0%, #07213b 100%);
  // background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100% !important;
  display: flex;
  justify-items: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
  .top {
    width: 95%;
    height: 65%;
    // background-color: aqua;
    display: flex;
    flex-direction: row;
    .Info_card {
      width: 30%;
      height: 100%;
      // background-color: crimson;
      display: flex;
      flex-direction: column;
      .Weather_card_box {
        width: 100%;
        height: 50%;
        display: flex;
        justify-items: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        .Weather_card {
          width: 95%;
          height: 95%;
          background-image: url("../../assets/img/SunSet.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          border-radius: 3%;
          display: flex;
          flex-direction: column;
          justify-items: center;
          // align-content: center;
          align-items: center;
          // justify-content: center;
          .location_and_time_box {
            width: 92%;
            height: 20%;
            display: flex;
            color: aliceblue;
            font-size: 20px;
            font-weight: 600;
            flex-direction: row;
            // align-content: space-between;
            justify-content: space-between;
            align-items: center;
          }
          .icon_temp {
            width: 92%;
            height: 40%;
            display: flex;
            margin-top: 3%;
            .img_box {
              height: 100%;
              width: 13%;
              // margin-right: 10%;
            }
            .temp {
              color: aliceblue;
              display: flex;
              margin-right: 20%;
              margin-top: 2%;
              .num {
                font-size: 70px;
              }
              .unit {
                font-size: 40px;
              }
            }
            .weather_des {
              margin-top: 1%;
              color: aliceblue;
              font-size: 25px;
              height: 100%;
              display: flex;
              justify-items: center;
              align-content: center;
              align-items: center;
              justify-content: center;
              .des {
                width: 100%;
                height: 50%;
              }
            }
          }
          .brief_des {
            width: 95%;
            height: 10%;
            color: aliceblue;
            font-size: 17px;
            margin-top: -4%;
          }
          .other_index {
            margin-top: 5%;
            width: 95%;
            height: 20%;
            display: flex;
            justify-content: space-between;
            // align-items: center;
            // justify-items: center;
            .item {
              height: 100%;
              // background-color: #fff;
              width: 15%;
              display: flex;
              flex-direction: column;
              // justify-items: center;
              // align-items: center;
              .property {
                color: rgb(181, 212, 240);
              }
              .data {
                color: aliceblue;
                font-size: 20px;
              }
            }
          }
        }
      }
      .tips_card_box {
        width: 100%;
        height: 50%;
        background-color: darkgreen;
      }
    }
    .title_map {
      width: 45%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;
      justify-items: center;
      justify-content: space-evenly;
      // justify-content: center;
      // background-color: dimgray;
      .title_box {
        width: 100%;
        height: 20%;
        // background-color: deeppink;
        display: flex;
        justify-items: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        .title {
          color: aliceblue;
          width: 55%;
          font-size: 30px;
        }
      }
      .map_box {
        width: 95%;
        height: 75%;
        border-radius: 8px;
        #map {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
        // background-color: chartreuse;
      }
    }
    .rank_bar_box {
      width: 25%;
      height: 100%;
      // background-color: aquamarine;
      display: flex;
      align-content: center;
      align-items: center;
      justify-items: center;
      justify-content: center;
      // border-radius: 10px;
      overflow: hidden;
      .rank_bar {
        height: 95%;
        width: 95%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-items: center;
        justify-content: center;
        border-radius: 10px;
        overflow: hidden;
        color: aliceblue;
        font-size: 20px;
        .rows {
          font-size: 30px;
        }
      }
    }
  }
  .bottom {
    width: 95%;
    height: 35%;
    // background-color: antiquewhite;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .hours_weather {
      height: 98%;
      width: 56%;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.08);
      .chart_box {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        #chart {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
    .days_weather {
      border-radius: 10px;
      height: 100%;
      width: 43%;
      background-color: blueviolet;
    }
  }
}
</style>