<template>
  <div>
    <div ref="earthchart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { ref, onMounted} from "vue";
import * as echarts from "echarts";
import "echarts-gl";
const earthchart = ref();

onMounted(() => {
  init();
});
function init() {
  var ROOT_PATH =
    "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples";
  const myChart = echarts.init(earthchart.value);
  // 指定图表的配置项和数据
  // let option ;
  var option = {
    backgroundColor: "rgba(0,0,0,0)",
    globe: {
      globeRadius :100,
      globeOuterRadius:200,
      baseTexture: require("assets/earth.jpg"),
      heightTexture:
        require("assets/bathymetry_bw_composite_4k.jpg"),
      displacementScale: 0.1,
      shading: "realistic",
      postEffect:{
        enable:true,
        bloom:{
          enable:true,
           bloomIntensity:0.1,
           focalDistance:50,
           focalRange:20,
           fstop:2.8,
           blurRadius:10,
        },
   
        SSAO:{
          enable:true,
          quality:'medium',
          radius:2,
          intensity:1
        } ,
      },
      viewControl:{
        autoRotate:false,
        zoomSensitivity:0,
        animation:true,
        animationDurationUpdate:1000,
        // animationEasingUpdate: cubicInOut,
        targetCoord: [120.46, 30.92],
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
        {
          type: "overlay",
          texture: require("assets/clouds.png"),
          shading: "lambert",
          distance: 5,
        },
      ],
    },
    series: [],
  };
  option && myChart.setOption(option);

  // myChart.showLoading();
  // axios.get("/echarts/data/asset/data/lines-bus.json").then((data) => {
  //   let hStep = 300 / (data.length - 1);
  //   let busLines = [].concat.apply(
  //     [],
  //     data.map(function (busLine, idx) {
  //       let prevPt = [];
  //       let points = [];
  //       for (let i = 0; i < busLine.length; i += 2) {
  //         let pt = [busLine[i], busLine[i + 1]];
  //         if (i > 0) {
  //           pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]];
  //         }
  //         prevPt = pt;
  //         points.push([pt[0] / 1e4, pt[1] / 1e4]);
  //       }
  //       return {
  //         coords: points,
  //         lineStyle: {
  //           normal: {
  //             color: echarts.color.modifyHSL(
  //               "#5A94DF",
  //               Math.round(hStep * idx)
  //             ),
  //           },
  //         },
  //       };
  //     })
  //   );

  //   // myChart.setOption(
  //   //   (option = {
  //   //     bmap: {
  //   //       center: [116.46, 39.92],
  //   //       zoom: 10,
  //   //       roam: true,
  //   //       mapStyle: {
  //   //         styleJson: [
  //   //           {
  //   //             featureType: 'water',
  //   //             elementType: 'all',
  //   //             stylers: {
  //   //               color: '#031628'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'land',
  //   //             elementType: 'geometry',
  //   //             stylers: {
  //   //               color: '#000102'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'highway',
  //   //             elementType: 'all',
  //   //             stylers: {
  //   //               visibility: 'off'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'arterial',
  //   //             elementType: 'geometry.fill',
  //   //             stylers: {
  //   //               color: '#000000'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'arterial',
  //   //             elementType: 'geometry.stroke',
  //   //             stylers: {
  //   //               color: '#0b3d51'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'local',
  //   //             elementType: 'geometry',
  //   //             stylers: {
  //   //               color: '#000000'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'railway',
  //   //             elementType: 'geometry.fill',
  //   //             stylers: {
  //   //               color: '#000000'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'railway',
  //   //             elementType: 'geometry.stroke',
  //   //             stylers: {
  //   //               color: '#08304b'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'subway',
  //   //             elementType: 'geometry',
  //   //             stylers: {
  //   //               lightness: -70
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'building',
  //   //             elementType: 'geometry.fill',
  //   //             stylers: {
  //   //               color: '#000000'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'all',
  //   //             elementType: 'labels.text.fill',
  //   //             stylers: {
  //   //               color: '#857f7f'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'all',
  //   //             elementType: 'labels.text.stroke',
  //   //             stylers: {
  //   //               color: '#000000'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'building',
  //   //             elementType: 'geometry',
  //   //             stylers: {
  //   //               color: '#022338'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'green',
  //   //             elementType: 'geometry',
  //   //             stylers: {
  //   //               color: '#062032'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'boundary',
  //   //             elementType: 'all',
  //   //             stylers: {
  //   //               color: '#465b6c'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'manmade',
  //   //             elementType: 'all',
  //   //             stylers: {
  //   //               color: '#022338'
  //   //             }
  //   //           },
  //   //           {
  //   //             featureType: 'label',
  //   //             elementType: 'all',
  //   //             stylers: {
  //   //               visibility: 'off'
  //   //             }
  //   //           }
  //   //         ]
  //   //       }
  //   //     },
  //   //     series: [
  //   //       {
  //   //         type: 'lines',
  //   //         coordinateSystem: 'bmap',
  //   //         polyline: true,
  //   //         data: busLines,
  //   //         silent: true,
  //   //         lineStyle: {
  //   //           // color: '#c23531',
  //   //           // color: 'rgb(200, 35, 45)',
  //   //           opacity: 0.2,
  //   //           width: 1
  //   //         },
  //   //         progressiveThreshold: 500,
  //   //         progressive: 200
  //   //       },
  //   //       {
  //   //         type: 'lines',
  //   //         coordinateSystem: 'bmap',
  //   //         polyline: true,
  //   //         data: busLines,
  //   //         lineStyle: {
  //   //           width: 0
  //   //         },
  //   //         effect: {
  //   //           constantSpeed: 20,
  //   //           show: true,
  //   //           trailLength: 0.1,
  //   //           symbolSize: 1.5
  //   //         },
  //   //         zlevel: 1
  //   //       }
  //   //     ]
  //   //   })
  //   // );
  // });

  // option && myChart.setOption(option);
}
</script>

<style lang="less" scoped>
</style>