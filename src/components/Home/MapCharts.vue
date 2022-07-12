<template>
  <div>
    <div ref="earthchart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import { echarts_data } from "assets/data/home/echarts";

const earthchart = ref();
const data = echarts_data;
onMounted(() => {
  init();
});

function init() {
  const city = [3291, 3307, 3289, 3292, 3263];
  const randNum = () => {
    return Math.ceil(Math.random() * echarts_data.airports.length);
  };
  const new_data = [];
  // const creatData = () => {
  //   for (let i = 0; i < 2; i++) {
  //     for (let j = 0; j < 1; j++) {
  //       let rd = randNum();
  //       let data_item = [Math.ceil(Math.random() * 5) - 1, city[i], rd];
  //       new_data.push(data_item);
  //     }
  //     for (let j = 0; j < 1; j++) {
  //       let rd = randNum();
  //       let data_item = [Math.ceil(Math.random() * 5) - 1, rd, city[i]];
  //       new_data.push(data_item);
  //     }
  //   }
  // };
  const myChart = echarts.init(earthchart.value);
  function getAirportCoord(idx) {
    // console.log(idx+':'+data.airports[idx][1])
    return [data.airports[idx][3], data.airports[idx][4]];
  }
  // creatData();
  console.log(new_data);
  var routes = new_data.map(function (airline) {
    return [getAirportCoord(airline[1]), getAirportCoord(airline[2])];
  });
  // 指定图表的配置项和数据
  // let option ;
  // for(let i=0 ;i<echarts_data.routes.length;i++){
  //   echarts_data.routes.length[i][0]=echarts_data.routes.length[i][0]/3
  // }
  var option = {
    backgroundColor: "rgba(0,0,0,0)",
    globe: {
      globeRadius: 80,
      globeOuterRadius: 130,
      baseTexture: require("assets/earth.jpg"),
      // heightTexture: require("assets/bathymetry_bw_composite_4k.jpg"),
      displacementScale: 0.1,
      shading: "lambert",
      postEffect: {
        enable: false,
        bloom: {
          enable: false,
          bloomIntensity: 0.1,
          focalDistance: 50,
          focalRange: 20,
          fstop: 2.8,
          blurRadius: 10,
        },

        SSAO: {
          enable: false,
          quality: "medium",
          radius: 2,
          intensity: 1,
        },
      },
      viewControl: {
        autoRotate: true,
        zoomSensitivity: 0,
        autoRotateSpeed:2,
        animation: true,
        animationDurationUpdate: 1000,
        animationEasingUpdate: "cubicInOut",
        targetCoord: [116.46, 4.92],
      },
      light: {
        ambient: {
          intensity: 0.1,
        },
        main: {
          intensity: 1.5,
        },
      },
      layers: [
        {
          type: "blend",
          blendTo: "emission",
          texture: require("assets/night.jpg"),
        },
        // {
        //   type: "overlay",
        //   texture: require("assets/clouds.png"),
        //   shading: "lambert",
        //   distance: 5,
        // },
      ],
    },
    series: {
      // type: "lines3D",
      // coordinateSystem: "globe",
      // blendMode: "lighter",
      // effect: {
      //   show: true,
      //   trailWidth: 5,
      //   trailOpacity: 1,
      //   trailLength: 1,
      //   period : 10,
      //   // constantSpeed: 40,
      // },
      // lineStyle: {
      //   width: 2,
      //   // color:"",
      //   color: "hsl(200,100%,50%)",
      //   opacity: 0.2,
      // },
      // data: routes,
    },
  };
  option && myChart.setOption(option);

  
}
</script>

<style lang="less" scoped>
</style>