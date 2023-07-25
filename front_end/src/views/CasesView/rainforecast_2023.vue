<template>
  <div style="width: 100%; height: 100%" class="content">
    <canvas
      id="cvs"
      style="position: absolute; background-color: black"
    ></canvas>
    <div class="top">
      <div class="Info_card">
        <div class="Weather_card_box">
          <div class="Weather_card">
            <div class="location_and_time_box">
              <div class="location_box">
                {{ province[this.num] + " " + city[this.num] }}
              </div>
              <div class="time_box">{{ curDate }} {{ timeofday }}</div>
            </div>
            <div class="icon_temp">
              <div class="img_box">
                <img
                  width="100%"
                  height="80%"
                  title="多云"
                  :src="
                    this.dataServer +
                    '/store/weather/icon/' +
                    this.curIconPath[this.num]
                  "
                />
              </div>
              <div class="temp">
                <div class="num">
                  <!-- 20 -->
                  {{ curTemprature[this.num] || " " }}
                </div>
                <div class="unit">°C</div>
              </div>
              <div class="weather_des">
                <div class="des">{{ curWeather[this.num] }}</div>
              </div>
            </div>
            <div class="brief_des">
              今天大部分地区{{ curWeather[this.num] }}。最高气温{{
                todayMaxTemp[this.num]
              }}°C，最低气温{{ todayMinTemp[this.num] }}°C。
            </div>
            <div class="other_index">
              <div class="wind_dir item">
                <div class="property">风向</div>
                <div class="data">{{ curWindDir[this.num] }}</div>
              </div>
              <div class="wind_level item">
                <div class="property">风速</div>
                <div class="data">{{ curWindLevel[this.num] }}</div>
              </div>
              <div class="humidity item">
                <div class="property">湿度</div>
                <div class="data">{{ curHumidity[this.num] }}%</div>
              </div>
              <div class="cloud item">
                <div class="property">云量</div>
                <div class="data">{{ curCloud[this.num] }}%</div>
              </div>
              <div class="rain item">
                <div class="property">降雨量</div>
                <div class="data">{{ curRain[this.num] }}mm/h</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="chart_card_box">
            <div class="chart_card">
              <div class="day_title"><h2>24小时气温</h2></div>
              <div class="chart_box">
                <div id="linechart"></div>
              </div>
            </div>
          </div> -->
        <div class="days_weather_box">
          <div class="days_weather">
            <div class="week_title"><h2>未来五天天气</h2></div>
            <div class="content_box">
              <div
                class="dayitem"
                v-for="(item, index) in weekData.slice(0, 5)"
                :key="index"
              >
                <div class="time">{{ item[this.num]["date"] }}</div>
                <div class="icon">
                  <img
                    class="iconTempPartIcon-E1_2"
                    :src="
                      this.dataServer +
                      '/store/weather/icon/' +
                      item[this.num]['iconPath']
                    "
                    title="雨"
                  />
                </div>
                <div class="max_min">
                  {{ Math.round(item[this.num]["minTemp"]) }}°C至{{
                    Math.round(item[this.num]["maxTemp"])
                  }}°C
                </div>
                <div class="weather">{{ item[this.num]["weather"] }}</div>
                <div class="wind">
                  {{ item[this.num]["windDir"] }}
                  {{ item[this.num]["windLevel"] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="title_map">
        <div class="title_box">
          <dv-decoration-3 style="width: 180px; height: 30px" />
          <div class="title">
            <h1>长三角水文综合模拟预报</h1>
          </div>
          <dv-decoration-3 style="width: 180px; height: 30px" />
        </div>
        <div class="map_box">
          <div id="map">
            <div @click="rainevent" class="rainbutton">历史降雨</div>
            <div v-show="ifrain" class="timebar">{{ this.raintime }}</div>
            <div v-show="ifrain" class="titlebar">流域淹没过程模拟</div>
            <div class="water_depth_color" style="z-index: 5" v-show="ifrain">
              <div class="color-bar">
                <div class="color">
                  <div
                    class="color-item"
                    style="background-color: #ffffff"
                  ></div>
                  <div
                    class="color-item"
                    style="background-color: #87cefa"
                  ></div>
                  <div
                    class="color-item"
                    style="background-color: #00bfff"
                  ></div>
                  <div
                    class="color-item"
                    style="background-color: #1e90ff"
                  ></div>
                  <div
                    class="color-item"
                    style="background-color: #0000ff"
                  ></div>
                </div>
                <div class="label">
                  <div class="color-item" style="text-align: left">0.0</div>
                  <div class="color-item" style="text-align: left">0.01</div>
                  <div class="color-item" style="text-align: left">1.0</div>
                  <div class="color-item" style="text-align: left">1.5</div>
                  <div class="color-item" style="text-align: left">2.0</div>
                  <div class="color-item" style="text-align: left">5.0</div>
                </div>
              </div>
            </div>
          </div>
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
      <div class="week_rain_box">
        <div class="week_rain">
          <div class="day_title"><h2>未来七天降雨</h2></div>
          <div class="chart_box">
            <div id="barchart"></div>
          </div>
        </div>
      </div>
      <!-- <div class="icons_box">
          <div class="icons">
            <div class="icon_title"><h2>天气仪表盘</h2></div>
            <div class="icon_contant">
              <div class="icon_rain">
                <div class="rain_title des">当前降雨</div>
                <dv-water-level-pond
                  :config="config1"
                  style="width: 80%; height: 80%"
                />
              </div>
              <div class="icon_temp">
                <div class="temp_title des">当前温度</div>
                <div id="gauge_chart"></div>
              </div>
              <div class="icon_wind">
                <div class="wind_title des">本月风向</div>
                <div id="rose_chart"></div>
              </div>
            </div>
          </div>
        </div> -->
      <div class="rain_icon_box">
        <div class="icon_rain">
          <div class="rain_title des">当前降雨</div>
          <dv-water-level-pond
            :config="config1"
            style="width: 80%; height: 80%"
          />
        </div>
      </div>
      <div class="wind_icon_box">
        <div class="icon_wind">
          <div class="wind_title des">未来七天风向频率</div>
          <div id="rose_chart"></div>
        </div>
      </div>
      <!-- <div class="days_weather">
          <div class="week_title"><h2>本周天气</h2></div>
          <div class="content_box">
            <div class="dayitem">
              <div class="time">周一</div>
              <div class="icon">
                <img
                  class="iconTempPartIcon-E1_2"
                  src="https://assets.msn.cn/weathermapdata/1/static/svg/72/v6/card/ModerateRainV2.svg"
                  title="雨"
                />
              </div>
              <div class="max_min">8°C至16°C</div>
              <div class="weather">大雨</div>
              <div class="wind">东北风 2级</div>
            </div>
            <div class="dayitem">
              <div class="time">周二</div>
              <div class="icon">
                <img
                  class="iconTempPartIcon-E1_2"
                  src="https://assets.msn.cn/weathermapdata/1/static/svg/72/v6/card/SunnyDayV3.svg"
                  title="晴朗"
                />
              </div>
              <div class="max_min">6°C至15°C</div>
              <div class="weather">晴</div>
              <div class="wind">东风 6级</div>
            </div>
            <div class="dayitem">
              <div class="time">周三</div>
              <div class="icon">
                <img
                  class="iconTempPartIcon-E1_1"
                  src="https://assets.msn.cn/weathermapdata/1/static/svg/72/v6/card/LightSnowV2.svg"
                  title="小雪"
                />
              </div>
              <div class="max_min">-1°C至-20°C</div>
              <div class="weather">雪</div>
              <div class="wind">东北风 2级</div>
            </div>
            <div class="dayitem">
              <div class="time">周四</div>
              <div class="icon">
                <img
                  class="iconTempPartIcon-E1_2"
                  src="https://assets.msn.cn/weathermapdata/1/static/svg/72/v6/card/SunnyDayV3.svg"
                  title="晴朗"
                />
              </div>
              <div class="max_min">2°C至8°C</div>
              <div class="weather">晴</div>
              <div class="wind">北风 3级</div>
            </div>
            <div class="dayitem">
              <div class="time">周五</div>
              <div class="icon">
                <img
                  class="iconTempPartIcon-E1_2"
                  src="https://assets.msn.cn/weathermapdata/1/static/svg/72/v6/card/CloudyV3.svg"
                  title="阴"
                />
              </div>
              <div class="max_min">7°C至12°C</div>
              <div class="weather">阴</div>
              <div class="wind">北风 5级</div>
            </div>
          </div>
        </div> -->
      <div class="hours_temp_box">
        <div class="chart_card">
          <div class="day_title"><h2>24小时气温</h2></div>
          <div class="chart_box">
            <div id="linechart"></div>
          </div>
        </div>
      </div>
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
import { useStore } from "vuex";
import { ElLoading } from "element-plus";
import { set } from "ol/transform";
// import { backUrl } from "./../../../public/backURL/backurl";
var map = null;
export default {
  data() {
    return {
      num: 63,
      pointlist: [],
      loadingInstance1: null,
      dataServer: useStore().getters.devIpAddress,
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
        headerBGC: "#08101E",
        evenRowBGC: "#063F7A",
        oddRowBGC: "#0D2944",
        headerHeight: 45,
      },
      config1: {
        data: [55],
        shape: "round",
        formatter: "{value}mm",
        colors: ["#00C9FF", "#92FE9D"],
        waveOpacity: 0.6,
      },
      barChart: {},
      map: {},
      layerid: ["05", "10", "11", "12", "13", "14", "15"],
      index: 0,
      ifrain: false,
      interval: {},
      raintime: "2022-07-29-05",
    };
  },
  watch: {
    //获得到当前的数据后，对降雨以及Weather_card中的数据进行修改
    currentData: {
      handler(newVal, oldVal) {
        // console.log("asdasdasd");
        var weathercard = document.querySelector(".Weather_card");
        weathercard.style.backgroundImage = "url('" + this.bgIMG + "')";
        this.config1 = {
          data: [this.curRain[this.num]],
          shape: "round",
          formatter: "{value}mm",
          colors: ["#00C9FF", "#92FE9D"],
          waveOpacity: 0.6,
        };
        this.initMap();
        this.clearSomething();
        this.loadingInstance1.close(); //将loading关闭
      },
    },
    //本周数据获取之后初始化柱状图和玫瑰图
    weekData: {
      handler(newVal, oldVal) {
        console.log("changed..");
        this.initbarchart();
        this.initrosechart();
      },
    },
    //今天24小时数据获取之后设置轮播图和折线图
    todayTemp: {
      handler(newVal, oldVal) {
        console.log("changed..");
        this.initlinechart();
        //轮播图部分的数据设置
        this.config = {
          header: ["城市", "最高温度", "最低温度"],
          data: [
            [
              "苏州市",
              "" + this.todayMaxTemp[111] + "°C",
              "" + this.todayMinTemp[111] + "°C",
            ],
            [
              "无锡市",
              "" + this.todayMaxTemp[115] + "°C",
              "" + this.todayMinTemp[115] + "°C",
            ],
            [
              "南京市",
              "" + this.todayMaxTemp[63] + "°C",
              "" + this.todayMinTemp[63] + "°C",
            ],
            [
              "常州市",
              "" + this.todayMaxTemp[107] + "°C",
              "" + this.todayMinTemp[107] + "°C",
            ],
            [
              "镇江市",
              "" + this.todayMaxTemp[72] + "°C",
              "" + this.todayMinTemp[72] + "°C",
            ],
            [
              "南通市",
              "" + this.todayMaxTemp[79] + "°C",
              "" + this.todayMinTemp[79] + "°C",
            ],
            [
              "连云港市",
              "" + this.todayMaxTemp[10] + "°C",
              "" + this.todayMinTemp[10] + "°C",
            ],
            [
              "宿迁市",
              "" + this.todayMaxTemp[31] + "°C",
              "" + this.todayMinTemp[31] + "°C",
            ],
            [
              "徐州市",
              "" + this.todayMaxTemp[5] + "°C",
              "" + this.todayMinTemp[5] + "°C",
            ],
            [
              "淮安市",
              "" + this.todayMaxTemp[44] + "°C",
              "" + this.todayMinTemp[44] + "°C",
            ],
            [
              "扬州市",
              "" + this.todayMaxTemp[69] + "°C",
              "" + this.todayMinTemp[69] + "°C",
            ],
            [
              "泰州市",
              "" + this.todayMaxTemp[70] + "°C",
              "" + this.todayMinTemp[70] + "°C",
            ],
            [
              "杭州市",
              "" + this.todayMaxTemp[161] + "°C",
              "" + this.todayMinTemp[161] + "°C",
            ],
            [
              "宁波市",
              "" + this.todayMaxTemp[196] + "°C",
              "" + this.todayMinTemp[196] + "°C",
            ],
            [
              "温州市",
              "" + this.todayMaxTemp[218] + "°C",
              "" + this.todayMinTemp[218] + "°C",
            ],
            [
              "嘉兴市",
              "" + this.todayMaxTemp[156] + "°C",
              "" + this.todayMinTemp[156] + "°C",
            ],
            [
              "湖州市",
              "" + this.todayMaxTemp[154] + "°C",
              "" + this.todayMinTemp[154] + "°C",
            ],
            [
              "绍兴市",
              "" + this.todayMaxTemp[233] + "°C",
              "" + this.todayMinTemp[233] + "°C",
            ],
            [
              "金华市",
              "" + this.todayMaxTemp[186] + "°C",
              "" + this.todayMinTemp[186] + "°C",
            ],
            [
              "衢州市",
              "" + this.todayMaxTemp[205] + "°C",
              "" + this.todayMinTemp[205] + "°C",
            ],
            [
              "丽水市",
              "" + this.todayMaxTemp[210] + "°C",
              "" + this.todayMinTemp[210] + "°C",
            ],
            [
              "合肥市",
              "" + this.todayMaxTemp[90] + "°C",
              "" + this.todayMinTemp[90] + "°C",
            ],
            [
              "芜湖市",
              "" + this.todayMaxTemp[98] + "°C",
              "" + this.todayMinTemp[98] + "°C",
            ],
            [
              "蚌埠市",
              "" + this.todayMaxTemp[53] + "°C",
              "" + this.todayMinTemp[53] + "°C",
            ],
            [
              "淮南市",
              "" + this.todayMaxTemp[56] + "°C",
              "" + this.todayMinTemp[56] + "°C",
            ],
            [
              "马鞍山市",
              "" + this.todayMaxTemp[100] + "°C",
              "" + this.todayMinTemp[100] + "°C",
            ],
            [
              "淮北市",
              "" + this.todayMaxTemp[21] + "°C",
              "" + this.todayMinTemp[21] + "°C",
            ],
            [
              "铜陵市",
              "" + this.todayMaxTemp[139] + "°C",
              "" + this.todayMinTemp[139] + "°C",
            ],
            [
              "安庆市",
              "" + this.todayMaxTemp[135] + "°C",
              "" + this.todayMinTemp[135] + "°C",
            ],
            [
              "黄山市",
              "" + this.todayMaxTemp[177] + "°C",
              "" + this.todayMinTemp[177] + "°C",
            ],
            [
              "滁州市",
              "" + this.todayMaxTemp[61] + "°C",
              "" + this.todayMinTemp[61] + "°C",
            ],
            [
              "阜阳市",
              "" + this.todayMaxTemp[47] + "°C",
              "" + this.todayMinTemp[47] + "°C",
            ],
            [
              "宿州市",
              "" + this.todayMaxTemp[24] + "°C",
              "" + this.todayMinTemp[24] + "°C",
            ],
            [
              "六安市",
              "" + this.todayMaxTemp[84] + "°C",
              "" + this.todayMinTemp[84] + "°C",
            ],
            [
              "亳州市",
              "" + this.todayMaxTemp[15] + "°C",
              "" + this.todayMinTemp[15] + "°C",
            ],
            [
              "池州市",
              "" + this.todayMaxTemp[137] + "°C",
              "" + this.todayMinTemp[137] + "°C",
            ],
            [
              "宣城市",
              "" + this.todayMaxTemp[142] + "°C",
              "" + this.todayMinTemp[142] + "°C",
            ],
            [
              "上海市闵行区",
              "" + this.todayMaxTemp[119] + "°C",
              "" + this.todayMinTemp[119] + "°C",
            ],
            [
              "上海市宝山区",
              "" + this.todayMaxTemp[120] + "°C",
              "" + this.todayMinTemp[120] + "°C",
            ],
            [
              "上海市嘉定区",
              "" + this.todayMaxTemp[121] + "°C",
              "" + this.todayMinTemp[121] + "°C",
            ],
            [
              "上海市徐家汇区",
              "" + this.todayMaxTemp[123] + "°C",
              "" + this.todayMinTemp[123] + "°C",
            ],
            [
              "上海市浦东区",
              "" + this.todayMaxTemp[124] + "°C",
              "" + this.todayMinTemp[124] + "°C",
            ],
            [
              "上海市金山区",
              "" + this.todayMaxTemp[164] + "°C",
              "" + this.todayMinTemp[164] + "°C",
            ],
            [
              "上海市青浦区",
              "" + this.todayMaxTemp[165] + "°C",
              "" + this.todayMinTemp[165] + "°C",
            ],
            [
              "上海市松江区",
              "" + this.todayMaxTemp[166] + "°C",
              "" + this.todayMinTemp[166] + "°C",
            ],
            [
              "上海市奉贤区",
              "" + this.todayMaxTemp[167] + "°C",
              "" + this.todayMinTemp[167] + "°C",
            ],
          ],
          // index: true,
          columnWidth: [200],
          align: ["center"],
          carousel: "page",
          rowNum: 8,
          headerBGC: "#08101E",
          evenRowBGC: "#063F7A",
          oddRowBGC: "#0D2944",
          headerHeight: 45,
        };
      },
    },
    num: {
      handler(newVal, oldVal) {
        this.initlinechart();
        this.initbarchart();
        this.initrosechart();
        var weathercard = document.querySelector(".Weather_card");
        weathercard.style.backgroundImage = "url('" + this.bgIMG + "')";
        this.config1 = {
          data: [this.curRain[this.num]],
          shape: "round",
          formatter: "{value}mm",
          colors: ["#00C9FF", "#92FE9D"],
          waveOpacity: 0.6,
        };
      },
    },
  },
  methods: {
    initMap() {
      //令牌
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
      //底图加载
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/johnnyt/cl9mkdnso000q15rlcoxiaab0",
        center: [118, 32],
        zoom: 6,
      });
      let map = this.map;
      let that = this;
      this.map.on("load", () => {
        map.on("click", "Points", (e) => {
          that.num = e.features[0].properties.index;
        });

        // Change the cursor to a pointer when
        // the mouse is over the states layer.
        map.on("mouseenter", "Points", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        // Change the cursor back to a pointer
        // when it leaves the states layer.
        map.on("mouseleave", "Points", () => {
          map.getCanvas().style.cursor = "";
        });
        map.loadImage(
          this.dataServer + "/store/weather/icon/ClearNightV3.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("ClearNightV3.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/CloudyV3.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("CloudyV3.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/FogV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("FogV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/Haze.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("Haze.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/HeavyDrizzle.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("HeavyDrizzle.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/LightRainV3.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("LightRainV3.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/LightSnowV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("LightSnowV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/ModerateRainV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("ModerateRainV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/MostlyClearNight.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("MostlyClearNight.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/MostlyCloudyDayV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("MostlyCloudyDayV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/MostlyCloudyNightV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("MostlyCloudyNightV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/MostlySunnyDay.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("MostlySunnyDay.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/N422Snow.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("N422Snow.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/PartlyCloudyDayV3.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("PartlyCloudyDayV3.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/PartlyCloudyNightV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("PartlyCloudyNightV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/RainShowersNightV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("RainShowersNightV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/RainSnowV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("RainSnowV2.svg", image);
          }
        );
        map.loadImage(
          this.dataServer + "/store/weather/icon/SnowShowersDayV2.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("SnowShowersDayV2.svg", image);
          }
        );
        // map.loadImage(
        //   this.dataServer + "/store/weather/icon/RainShowersDayV2.png",
        //   (error, image) => {
        //     if (error) throw error;
        //     map.addImage("SnowShowersDayV2.svg", image);
        //   }
        // );
        // map.loadImage(
        //   this.dataServer + "/store/weather/icon/RainShowersDayV2.png",
        //   (error, image) => {
        //     if (error) throw error;
        //     map.addImage("SnowShowersDayV2.svg", image);
        //   }
        // );
        map.loadImage(
          this.dataServer + "/store/weather/icon/SunnyDayV3.png",
          (error, image) => {
            if (error) throw error;
            for (var i = 0; i < 237; i++) {
              this.pointlist.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [this.lon[i], this.lat[i]],
                },
                properties: {
                  title: this.city[i],
                  url: this.curIconPath[i],
                  index: i,
                  rain: this.curRain[i],
                },
              });
            }
            map.addImage("SunnyDayV3.svg", image);
            map.addSource("Points", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: this.pointlist,
              },
            });
            map.addLayer({
              id: "Points",
              type: "symbol",
              source: "Points",
              paint: {
                "text-color": "#F0F8FF",
              },
              layout: {
                "icon-image": ["get", "url"],
                "icon-size": 0.3,
                "icon-offset": [0, -45],
                "text-field": ["get", "title"],
                "text-font": ["Brush Script MT", "Arial Unicode MS Normal"],
                "text-offset": [1.7, -1.5],
                "text-anchor": "top",
              },
            });
            // map.addLayer({
            //   id: "wms-test-layer",
            //   type: "raster",
            //   source: {
            //     type: "raster",
            //     tiles: [
            //       "http://localhost:8080/geoserver/semis/wms?service=WMS&version=1.1.0&request=GetMap&layers=semis%3ACH_WRT_DEPTH_TS_2016_06_17_015000&bbox=1273979.5752012993%2C3441095.310892064%2C1333039.1912291313%2C3506111.948709447&width=697&height=768&srs=EPSG%3A45556&styles=&format=application/openlayers",
            //     ],
            //     tileSize: 256,
            //   },
            //   paint: {},
            // });
            map.addLayer({
              id: "Pointscircle",
              type: "circle",
              source: "Points",
              filter: [">", "rain", 4],
              paint: {
                // Make circles larger as the user zooms from z12 to z22.
                "circle-radius": ["step", ["get", "rain"], 7, 4, 7, 18, 7],
                // Color circles by ethnicity, using a `match` expression.
                "circle-color": [
                  "step",
                  ["get", "rain"],
                  "#51bbd6",
                  4,
                  "#FF7E00",
                  18,
                  "#DD001B",
                ],
              },
            });
          }
        );
      });
    },
    //初始化24小时气温折线图
    initlinechart() {
      var chartDom = document.getElementById("linechart");
      var myChart = echarts.init(chartDom);
      var option;
      var data = [];
      for (var i = 0; i < 12; i++) {
        data[i] = this.todayTemp[this.num][i * 2];
      }
      const dateList = data.map(function (item) {
        return item[0];
      });
      const valueList = data.map(function (item) {
        return item[1];
      });
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
          axisLine: {
            lineStyle: {
              color: "#F0F8FF",
            },
          },
          axisLabel: {
            fontSize: 14,
          },
        },
        yAxis: {
          type: "value",
          show: false,
          minInterval: 5,
          axisLine: {
            lineStyle: {
              color: "rgba(241,243,244,.6)",
            },
            onZero: false,
          },
          axisLabel: {
            fontSize: 14,
            color: "#F0F8FF",
          },
        },
        series: [
          {
            data: data,
            type: "line",
            label: {
              formatter: function (param) {
                return param.data[1] + "°C";
              },
              show: true,
              color: "#F0F8FF",
              fontSize: 14,
            },
            smooth: true,
            areaStyle: {},
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //初始化未来7天降雨柱状图
    initbarchart() {
      var chartDom = document.getElementById("barchart");
      this.barChart = echarts.init(chartDom);
      var option;
      var dayArray = [];
      var dataArray = [];
      for (var i = 0; i < 7; i++) {
        dayArray[i] = this.weekData[i][this.num]["date"];
        dataArray[i] = parseFloat(this.weekRain[i][this.num]);
      }
      console.log(dayArray);
      console.log(dataArray);
      option = {
        xAxis: {
          type: "category",
          data: dayArray,
          axisLine: {
            lineStyle: {
              color: "#F0F8FF",
            },
          },
          axisLabel: {
            fontSize: 14,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#F0F8FF",
            },
          },
          axisLabel: {
            fontSize: 14,
          },
        },
        series: [
          {
            data: dataArray,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
          },
        ],
      };
      option && this.barChart.setOption(option);
    },
    //初始化风向频率玫瑰图
    initrosechart() {
      var chartDom = document.getElementById("rose_chart");
      var myChart = echarts.init(chartDom);
      var option;
      var data = [0, 0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 7; i++) {
        console.log(this.weekData[i][this.num]["windDir"]);
        if (this.weekData[i][this.num]["windDir"] == "北风") {
          data[0] += 1;
        }
        if (this.weekData[i][this.num]["windDir"] == "东北风") {
          data[1] += 1;
        }
        if (this.weekData[i][this.num]["windDir"] == "东风") {
          data[2] += 1;
        }
        if (this.weekData[i][this.num]["windDir"] == "东南风") {
          data[3] += 1;
        }
        if (this.weekData[i][this.num]["windDir"] == "南风") {
          data[4] += 1;
        }
        if (this.weekData[i][this.num]["windDir"] == "西南风") {
          data[5] += 1;
        }
        if (this.weekData[i][this.num]["windDir"] == "西风") {
          data[6] += 1;
        }
        if (this.weekData[i][this.num]["windDir"] == "西北风") {
          data[7] += 1;
        }
      }
      console.log(data);
      option = {
        tooltip: {
          trigger: "axis",
        },
        radar: [
          {
            indicator: [
              { text: "北", max: 3 },
              { text: "东北", max: 3 },
              { text: "东", max: 3 },
              { text: "东南", max: 3 },
              { text: "南", max: 3 },
              { text: "西南", max: 3 },
              { text: "西", max: 3 },
              { text: "西北", max: 3 },
            ],
            center: ["50%", "50%"],
            radius: 80,
            startAngle: 90,
            splitNumber: 4,
            shape: "circle",
            axisName: {
              color: "#14334F",
              fontSize: 15,
            },
            splitArea: {
              areaStyle: {
                color: ["#77EADF", "#26C3BE", "#64AFE9", "#428BD4"],
                shadowColor: "rgba(0, 0, 0, 0.2)",
                shadowBlur: 10,
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(211, 253, 250, 0.8)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(211, 253, 250, 0.8)",
              },
            },
          },
        ],
        series: [
          {
            type: "radar",
            // areaStyle: {},
            color: "#147CAD",
            areaStyle: {
              color: "#147CAD",
            },
            data: [
              {
                name: "Precipitation",
                value: data,
              },
            ],
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //。。。
    initcanvas() {
      const cvs = document.querySelector("#cvs");
      console.log(cvs);
      const ctx = cvs.getContext("2d");
      const { clientWidth: width, clientHeight: height } =
        document.documentElement;
      cvs.width = width;
      cvs.height = height;
      ctx.fillStyle = "#ffffff";
      const bgColors = Array.from(new Array(400)).map((v) => {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          step: Math.random() * 2.5 + 0.5,
        };
      });
      const render = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        bgColors.forEach((v) => {
          v.y = v.y > height ? 0 : v.y + v.step;
          ctx.rect(v.x, v.y, 3, 3);
        });
        ctx.fill();
        requestAnimationFrame(render);
      };
      render();
    },
    rainevent() {
      let button1 = document.querySelector(".rainbutton");
      if (!this.ifrain) {
        button1.style.background = `linear-gradient(123.92deg, rgb(79, 43, 143) 3.41%, rgb(40, 78, 162) 100%) border-box border-box`;
        this.map.setZoom(9);
        this.map.panTo([119.016, 31.845]);
        this.map.addSource("sur", {
          type: "raster",
          tiles: [
            "http://localhost:8080/geoserver/semis/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=semis:SUR_WRT_DEPTH_TS_2016_06_17_0" +
              this.layerid[this.index] +
              "000&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG:3857&bbox={bbox-epsg-3857}&WIDTH=732&HEIGHT=768",
          ],
          tileSize: 512, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
        });
        let sur = {
          show: true,
          name: "sur",
          id: "sur",
          source: "sur",
          type: "raster",
        };
        this.map.addLayer(sur);
        this.map.addSource("river", {
          type: "raster",
          tiles: [
            "http://localhost:8080/geoserver/semis/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=semis:CH_WRT_DEPTH_TS_2016_06_17_0" +
              this.layerid[this.index] +
              "000&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG:3857&bbox={bbox-epsg-3857}&WIDTH=732&HEIGHT=768",
          ],
          tileSize: 512, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
        });
        let river = {
          show: true,
          name: "river",
          id: "river",
          source: "river",
          type: "raster",
        };
        this.map.addLayer(river);
        // this.map.moveLayer("river", "Pointscircle");
        // this.map.moveLayer("sur", "Pointscircle");
        // this.map.moveLayer("river", "Points");
        // this.map.moveLayer("sur", "Points");
        this.map.removeLayer("Pointscircle");
        this.map.removeLayer("Points");
        this.interval = setInterval(() => {
          this.changelayer();
        }, 2000);
      } else {
        button1.style.background = `linear-gradient(128.16deg, rgba(97, 129, 255, 0.5) -0.31%, rgba(112, 0, 255, 0.5) 103%) border-box`;
        clearInterval(this.interval);
        this.map.removeLayer("sur");
        this.map.removeSource("sur");
        this.map.removeLayer("river");
        this.map.removeSource("river");
        this.map.addLayer({
          id: "Points",
          type: "symbol",
          source: "Points",
          paint: {
            "text-color": "#F0F8FF",
          },
          layout: {
            "icon-image": ["get", "url"],
            "icon-size": 0.3,
            "icon-offset": [0, -45],
            "text-field": ["get", "title"],
            "text-font": ["Brush Script MT", "Arial Unicode MS Normal"],
            "text-offset": [1.7, -1.5],
            "text-anchor": "top",
          },
        });
        this.map.addLayer({
          id: "Pointscircle",
          type: "circle",
          source: "Points",
          filter: [">", "rain", 4],
          paint: {
            // Make circles larger as the user zooms from z12 to z22.
            "circle-radius": ["step", ["get", "rain"], 7, 4, 7, 18, 7],
            // Color circles by ethnicity, using a `match` expression.
            "circle-color": [
              "step",
              ["get", "rain"],
              "#51bbd6",
              4,
              "#FF7E00",
              18,
              "#DD001B",
            ],
          },
        });
      }
      this.ifrain = !this.ifrain;
    },
    changelayer() {
      this.index += 1;
      this.raintime = "2022-07-29-" + this.layerid[this.index];
      this.map.removeLayer("sur");
      this.map.removeSource("sur");
      this.map.removeLayer("river");
      this.map.removeSource("river");
      this.map.addSource("sur", {
        type: "raster",
        tiles: [
          "http://localhost:8080/geoserver/semis/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=semis:SUR_WRT_DEPTH_TS_2016_06_17_0" +
            this.layerid[this.index] +
            "000&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG:3857&bbox={bbox-epsg-3857}&WIDTH=732&HEIGHT=768",
        ],
        tileSize: 512, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
      });
      let sur = {
        show: true,
        name: "sur",
        id: "sur",
        source: "sur",
        type: "raster",
      };
      this.map.addSource("river", {
        type: "raster",
        tiles: [
          "http://localhost:8080/geoserver/semis/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=semis:CH_WRT_DEPTH_TS_2016_06_17_0" +
            this.layerid[this.index] +
            "000&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG:3857&bbox={bbox-epsg-3857}&WIDTH=732&HEIGHT=768",
        ],
        tileSize: 512, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
      });
      let river = {
        show: true,
        name: "river",
        id: "river",
        source: "river",
        type: "raster",
      };
      this.map.addLayer(sur);
      this.map.addLayer(river);
      //   this.map.moveLayer("river", "Pointscircle");
      //   this.map.moveLayer("sur", "Pointscircle");
      //   this.map.moveLayer("river", "Points");
      //   this.map.moveLayer("sur", "Points");
      if (this.index == 6) {
        this.index = 0;
      }
    },
    clearSomething() {
      document.getElementsByClassName("mapboxgl-ctrl-bottom-left")[0].remove();
      document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0].remove();
    },
  },
  computed: {
    ...mapState("weather", [
      "currentData",
      "curCloud",
      "curDate",
      "curRain",
      "stationID",
      "curTemprature",
      "curHumidity",
      "timeofday",
      "curWeather",
      "curWindDir",
      "curWindLevel",
      "weekData",
      "weekRain",
      "todayTemp",
      "todayMaxTemp",
      "todayMinTemp",
      "curIconPath",
      "curBGIPath",
      "city",
      "province",
      "lon",
      "lat",
    ]),
    bgIMG() {
      return (
        this.dataServer +
        "/store/weather/background/" +
        this.curBGIPath[this.num]
      );
    },
    // ...mapGetters("weather", ["CurrentWeather"]),
  },
  created() {
    this.$store.dispatch("weather/getCurrentWeatherInfo");
    this.$store.dispatch("weather/getWeekWeatherInfo");
    this.$store.dispatch("weather/get24hoursWeatherInfo");
  },
  mounted() {
    // this.initlinechart();
    // this.initbarchart();
    // this.initGaugechart();
    // this.initrosechart();
    // this.initcanvas();
    this.loadingInstance1 = ElLoading.service({
      fullscreen: true,
      background: "black",
    });
    let that = this;
    // setInterval(() => {
    //   that.$store.dispatch("weather/getCurrentWeatherInfo");
    // }, 3600000);
  },
};
</script>
  
  <style lang="less" scoped>
.content {
  background: linear-gradient(180deg, #244d72 0%, #07213b 100%);
  // background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0);
  background-size: 100% 100%;
  width: 100%;
  height: 100% !important;
  display: flex;
  justify-items: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
  #cvs {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #244d72 0%, #07213b 100%);
    z-index: 0;
  }
  .top {
    width: 95%;
    height: 65%;
    // background-color: aqua;
    display: flex;
    flex-direction: row;
    z-index: 1;
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
          margin-top: 2%;
          // background-image: url("../../assets/img/Weather/bgimg/SunSet.png");
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
              img {
                height: 80%;
                width: 100%;
              }
              // margin-right: 10%;
            }
            .temp {
              color: aliceblue;
              display: flex;
              margin-right: 20%;
              // margin-top: 2%;
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
      // .chart_card_box {
      //   width: 100%;
      //   height: 50%;
      //   display: flex;
      //   justify-items: center;
      //   align-content: center;
      //   align-items: center;
      //   justify-content: center;
      //   .chart_card {
      //     width: 95%;
      //     height: 95%;
      //     border-radius: 10px;
      //     background: linear-gradient(
      //       rgb(49, 116, 183) 0%,
      //       rgb(0, 62, 124) 87.55%
      //     );
      //     display: flex;
      //     flex-direction: column;
      //     justify-items: center;
      //     align-content: center;
      //     align-items: center;
      //     justify-content: center;
      //     .day_title {
      //       margin-top: 1%;
      //       color: aliceblue;
      //       font-size: 20px;
      //       // margin-top: 1%;
      //     }
      //     .chart_box {
      //       width: 100%;
      //       height: 100%;
      //       border-radius: 10px;
      //       #linechart {
      //         margin-left: -5%;
      //         width: 110%;
      //         height: 100%;
      //         border-radius: 10px;
      //       }
      //     }
      //   }
      // }
      .days_weather_box {
        width: 100%;
        height: 50%;
        display: flex;
        justify-items: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        .days_weather {
          // margin-right: 3%;
          border-radius: 10px;
          height: 96%;
          width: 96%;
          background: linear-gradient(rgb(36, 77, 114) 0%, rgb(7, 33, 59) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          .week_title {
            color: aliceblue;
            font-size: 20px;
            margin-top: 1%;
          }
          .content_box {
            width: 100%;
            height: 100%;
            display: flex;
            // flex-direction: column;
            align-items: center;
            // justify-content: space-evenly;
            // align-content: space-evenly;
            justify-content: space-evenly;
            .dayitem {
              height: 79%;
              background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.07) 41.67%
              );
              width: 15%;
              border-radius: 6px;
              color: aliceblue;
              display: flex;
              flex-direction: column;
              justify-items: center;
              align-items: center;
              .time {
                font-weight: 700;
                font-size: 17px;
                // width: 100%;
              }
              .icon {
                margin-top: 30%;
                img {
                  width: 45px;
                }
              }
              .max_min {
                font-weight: 600;
                font-size: 13px;
              }
              .weather {
                margin-top: 10%;
                color: rgb(181, 212, 240);
              }
              .wind {
                margin-top: 33%;
              }
            }
          }
        }
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
          display: flex;
          justify-items: center;
          align-content: center;
          align-items: center;
          justify-content: center;
          color: aliceblue;
          width: 55%;
          font-size: 20px;
        }
      }
      .map_box {
        width: 95%;
        height: 75%;
        border-radius: 8px;
        position: relative;
        // .mapboxgl-ctrl {
        //   display: none !important;
        // }
        .rainbutton {
          color: #fff;
          position: absolute;
          right: 10px;
          bottom: 20px;
          z-index: 4;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 36px;
          background: linear-gradient(
              128.16deg,
              rgba(97, 129, 255, 0.5) -0.31%,
              rgba(112, 0, 255, 0.5) 103%
            )
            border-box;
          cursor: pointer;

          border-radius: 4px;
        }
        #map {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          .timebar {
            position: absolute;
            z-index: 1;
            left: 15px;
            top: 20px;
            font-size: 50px;
            color: #fff;
            font-weight: 600;
          }
          .titlebar {
            position: absolute;
            z-index: 1;
            left: 50px;
            top: 65px;
            font-size: 30px;
            color: #fff;
            font-weight: 400;
          }
          .water_depth_color {
            width: 230px;
            height: 40px;
            padding: 5px 15px;
            z-index: 9;
            position: absolute;
            bottom: 15px;
            left: 20px;

            display: flex;
            align-items: center;
            background-color: rgba(124, 120, 120, 0.2);
            border-radius: 5px;
            /* box-shadow: 2px 2px 2px #aaa; */
            opacity: 0.9;
            color: #b9b8ce;
          }

          .water_depth_color .color-bar {
            display: flex;
            height: fit-content;
            flex-direction: column;
            /* background-color: red; */
          }

          .water_depth_color .color-bar .color {
            width: fit-content;
            height: fit-content;
            display: flex;
            padding-left: 10px;
          }

          .water_depth_color .color-bar .label {
            display: flex;
            height: fit-content;
            width: fit-content;
            font-size: 12px;
            // padding-right: 2px;
          }

          .water_depth_color .color-bar .color-item {
            width: 36px;
            height: 12px;
          }
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
    z-index: 1;
    width: 95%;
    height: 35%;
    // background-color: antiquewhite;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .week_rain_box {
      width: 30%;
      height: 96%;
      display: flex;
      justify-items: center;
      align-content: center;
      align-items: center;
      justify-content: center;
      .week_rain {
        height: 100%;
        width: 96%;
        border-radius: 10px;
        // background: rgba(255, 255, 255, 0.08);
        background: linear-gradient(#516395 0%, #413253 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        .day_title {
          margin-top: 1%;
          color: aliceblue;
          font-size: 20px;
          // margin-top: 1%;
        }
        .chart_box {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          overflow: hidden;
          #barchart {
            // margin-left: -3%;
            margin-top: -8%;
            width: 105%;
            height: 130%;
            border-radius: 10px;
          }
        }
      }
    }
    // .days_weather {
    //   border-radius: 10px;
    //   height: 96%;
    //   width: 43%;
    //   background: linear-gradient(rgb(36, 77, 114) 0%, rgb(7, 33, 59) 100%);
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   .week_title {
    //     color: aliceblue;
    //     font-size: 20px;
    //     margin-top: 1%;
    //   }
    //   .content_box {
    //     width: 100%;
    //     height: 100%;
    //     display: flex;
    //     // flex-direction: column;
    //     align-items: center;
    //     // justify-content: space-evenly;
    //     // align-content: space-evenly;
    //     justify-content: space-evenly;
    //     .dayitem {
    //       height: 95%;
    //       background: linear-gradient(
    //         180deg,
    //         rgba(255, 255, 255, 0) 0%,
    //         rgba(255, 255, 255, 0.07) 41.67%
    //       );
    //       width: 15%;
    //       border-radius: 6px;
    //       color: aliceblue;
    //       display: flex;
    //       flex-direction: column;
    //       justify-items: center;
    //       align-items: center;
    //       .time {
    //         font-weight: 700;
    //         font-size: 18px;
    //         // width: 100%;
    //       }
    //       .icon {
    //         margin-top: 30%;
    //         img {
    //           width: 45px;
    //         }
    //       }
    //       .max_min {
    //         font-weight: 600;
    //         font-size: 15px;
    //       }
    //       .weather {
    //         margin-top: 10%;
    //         color: rgb(181, 212, 240);
    //       }
    //       .wind {
    //         margin-top: 40%;
    //       }
    //     }
    //   }
    // }
    .hours_temp_box {
      width: 35%;
      height: 100%;
      display: flex;
      justify-items: center;
      align-content: center;
      align-items: center;
      justify-content: center;
      .chart_card {
        width: 97%;
        height: 95%;
        border-radius: 10px;
        background: linear-gradient(
          rgb(25, 136, 201) 0%,
          rgb(48, 52, 175) 100%
        );
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        .day_title {
          margin-top: 1%;
          color: aliceblue;
          font-size: 20px;
          // margin-top: 1%;
        }
        .chart_box {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          overflow: hidden;
          #linechart {
            margin-left: -8%;
            margin-top: -2%;
            width: 115%;
            height: 110%;
            border-radius: 10px;
          }
        }
      }
    }
    .rain_icon_box {
      width: 17%;
      height: 96%;
      margin-left: 1%;
      display: flex;
      justify-items: center;
      align-content: center;
      align-items: center;
      justify-content: center;
      .icon_rain {
        // margin-top: 2%;
        background: linear-gradient(
          360deg,
          rgb(7, 117, 164) 29.99%,
          rgb(11, 132, 125) 100%
        );
        border-radius: 10px;
        height: 100%;
        width: 96%;
        display: flex;
        flex-flow: column;
        justify-items: center;
        align-items: center;
        justify-content: space-evenly;
        // align-content: space-between;
        .des {
          // width: 20%;
          // line-height: 100%;
          // margin-top: 1%;
          font-size: 30px;
          font-weight: 600;
          color: aliceblue;
          // height: 10%;
        }
        // align-content: space-around;
        // margin-left: 2%;
      }
    }
    .wind_icon_box {
      width: 17%;
      height: 96%;
      display: flex;
      justify-items: center;
      align-content: center;
      align-items: center;
      justify-content: center;
      .icon_wind {
        background: linear-gradient(
          360deg,
          rgb(209, 245, 252) 29.99%,
          rgb(32, 146, 207) 100%
        );
        border-radius: 10px;
        height: 100%;
        width: 96%;
        display: flex;
        flex-flow: column;
        justify-items: center;
        align-items: center;
        justify-content: space-evenly;
        .des {
          // width: 20%;
          // line-height: 100%;
          margin-top: 2%;
          font-size: 30px;
          font-weight: 600;
          color: aliceblue;
          // height: 10%;
        }
        #rose_chart {
          width: 100%;
          height: 100%;
        }
      }
    }
    // .icons_box {
    //   width: 36%;
    //   height: 96%;
    //   display: flex;
    //   justify-items: center;
    //   align-content: center;
    //   align-items: center;
    //   justify-content: center;
    //   background: linear-gradient(
    //     360deg,
    //     rgb(7, 117, 164) 29.99%,
    //     rgb(11, 132, 125) 100%
    //   );
    //   border-radius: 10px;
    //   .icons {
    //     width: 96%;
    //     height: 100%;
    //     display: flex;
    //     flex-direction: column;
    //     justify-items: center;
    //     align-content: center;
    //     align-items: center;
    //     justify-content: center;
    //     .icon_title {
    //       height: 15%;
    //       // margin-top: 1%;
    //       color: aliceblue;
    //       font-size: 20px;
    //       // margin-top: 1%;
    //     }
    //     .icon_contant {
    //       // margin-top: 2%;
    //       height: 85%;
    //       display: flex;
    //       width: 100%;
    //       justify-content: space-evenly;
    //       align-items: center;
    //       justify-items: center;
    //       align-content: center;
    // .des {
    //   // width: 20%;
    //   // line-height: 100%;
    //   font-size: 20px;
    //   font-weight: 600;
    //   color: rgb(181, 212, 240);
    //   height: 10%;
    // }
    //       .icon_rain {
    //         // margin-top: 2%;
    //         width: 33%;
    //         height: 90%;
    //         display: flex;
    //         flex-flow: column;
    //         justify-items: center;
    //         align-items: center;
    //         justify-content: space-between;
    //         align-content: space-between;
    //         // align-content: space-around;
    //         // margin-left: 2%;
    //       }
    //       .icon_temp {
    //         // margin-left: 5%;
    //         // margin-top: 2%;
    //         width: 50%;
    //         height: 90%;
    //         display: flex;
    //         flex-flow: column;
    //         justify-items: center;
    //         align-items: center;
    //         justify-content: space-between;
    //         // margin-left: 3%;
    //         #gauge_chart {
    //           width: 100%;
    //           height: 100%;
    //         }
    //       }
    //       .icon_wind {
    //         width: 50%;
    //         height: 90%;
    //         display: flex;
    //         flex-flow: column;
    //         justify-items: center;
    //         align-items: center;
    //         justify-content: space-between;
    //         // margin-left: 3%;
    //         // margin-left: 12%;
    //         #rose_chart {
    //           width: 100%;
    //           height: 100%;
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
</style>