<template>
  <div ref="home1" class="home1">
    <div class="container">
      <h1 style="margin-top: 3.75%; position: relative; z-index: 2;display:flex;justify-content: center;">
<!--        <span style="background: transparent" class="border-box">长三角综合模拟器</span>-->
        <dv-border-box8 dur="3" style="width: 20%;padding: 3px">长三角综合模拟器</dv-border-box8>
      </h1>
      <div
        style="
          position: absolute;
          width: 100vw;
          height: 5vh;
          top: 17vh;
          z-index:2;
          display: flex;
          justify-content: space-around;
        "
      >
        <el-button size="large" class="border-box flowbtn"
          >灾害响应与治理</el-button>
        <el-button size="large" class="border-box flowbtn"
          >全球变化与区域环境演化</el-button
        >
        <el-button size="large" class="border-box flowbtn"
          >城市化与人地关系协调发展</el-button
        >
        <el-button
          size="large"
          class="border-box flowbtn"
          style="margin-right: 0 !important"
          >流域水循环及驱动机制</el-button
        >
      </div>

      <div
        class="desContainer"
        :class="{ show_ani: props.show, hide_ani: !props.show }"
      >
        <el-divider style="margin: 5px 0 5px 0"></el-divider>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长三角模拟器汇聚了大量长江三角洲区域的地理模型和数据资源，用以揭示区域水循环及其内部驱动机理的水循环，阐明全球气候变化条件下区域环境演化规律，以及长三角城市化与人地关系相互作用的互动互馈机制的综合集成模型，实现区域灾害的快速响应与治理，服务于长三角高质量一体化发展国家战略。
        </p>
        <el-divider style="margin: 15px 0 -5px 0"></el-divider>
        <div class="login">
          <!-- <el-input
            v-model="input"
            type="password"
            placeholder="邮件地址"
            show-password
          /> -->
          <el-button
            @click="toSci()"
            style="margin-top: 3vh; width: 100%"
            type="primary"
            ><el-icon><Bottom /></el-icon>&nbsp;探索科学问题</el-button
          >
        </div>
      </div>
      <div class="data-charts">
        <div id="main1"></div>
                <div id="main2"></div>

      </div>
      <div class="merge-earth"></div>
      <MapCharts class="earth"></MapCharts>
      <img class="triangle" src="@/assets/triangle.png" alt="" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1680 40"
        class="position-absolute width-full z-1"
        style="bottom: -1px"
      >
        <path d="M0 40h1680V30S1340 0 840 0 0 30 0 30z" fill="#fff"></path>
      </svg>
    </div>
    <!-- <div>
      <p
        class="introduce"
        :class="{ show_ani: props.show, hide_ani: !props.show }"
      >
        长江三角洲区域自然资源丰富、经济发展活跃，<br>是人地活动最频繁的地区之一，<br>
        是全球变化敏感区, <br>
        是洪涝灾害易发区,<br>是长江经济带发展引擎区,<br>是新型城镇化先行区。
      </p>
      <img
        @click="toModel"
        :class="{ show_ani: props.show, hide_ani: !props.show }"
        class="map"
        src="http://i-1.33app.net/2021/3/12/87e04633-4304-4cc0-a5eb-9450a3e4d1d3.jpg"
        alt=""
      /> -->
    <!-- <MapCharts class="map"></MapCharts> -->
    <!-- <p class="cyberpunk inverse dotted introduce" v-if="show">
        长江三角洲区域自然资源丰富、经济发展活跃，是人地活动最频繁的地区之一，在沉积学意义上，地处东部沿海，受季风气候与海面升降影响，是全球变化敏感区；在自然地理学意义上，地处长江下游平原地区，地势低洼，易洪易涝，是洪涝灾害易发区；在区域经济发展意义上，地处江海交汇，上海为龙头，长江黄金水道为纽带，是长江经济带发展引擎区；在行政区划上，地处世界经济最活跃区域，城市群、都市圈体系完备，区域内、区际间差异显著，是新型城镇化先行区。
      </p> -->
    <!-- <Fire style="position: fixed; top: 0px; left: 0; z-index: -1"></Fire> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import {
  reactive,
  computed,
  ref,
  onMounted,
  defineProps,
  defineEmits,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MapCharts from "components/Home/MapCharts.vue";
import * as echarts from 'echarts';

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["toSci"]);

const toModel = () => {
  router.push("/model");
};

const home1 = ref();

const toSci = () => {
  emit("toSci");
};

setTimeout(() => {
  var chartDom1 = document.getElementById('main1');
var myChart1 = echarts.init(chartDom1, 'dark');
var option1;
option1 = {
  title: {
    text: '资源分布情况'
  },
  toolbox: {
    // y: 'bottom',
    feature: {
      magicType: {
        type: ['stack']
      },
      dataView: {},
      saveAsImage: {
        pixelRatio: 2
      }
    }
  },
  angleAxis: {
    type: 'category',
    data: ['灾害', '环境', '城市', '流域']
  },
  radiusAxis: {},
  polar: {},
  backgroundColor:"transparent",
  series: [
    {
      type: 'bar',
      data: [1, 2, 3, 4],
      coordinateSystem: 'polar',
      name: '模型',
      stack: 'a',
      emphasis: {
        focus: 'series'
      }
    },
    {
      type: 'bar',
      data: [2, 5, 1, 5],
      coordinateSystem: 'polar',
      name: '数据',
      stack: 'a',
      emphasis: {
        focus: 'series'
      }
    },
  ],
  legend: {
    show: true,
    data: ['模型', '数据']
  }
};

option1 && myChart1.setOption(option1);


var chartDom2 = document.getElementById('main2');
var myChart2 = echarts.init(chartDom2, 'dark');
var option2;
var xAxisData = [];
var data1 = [];
var data2 = [];
for (var i = 0; i < 100; i++) {
  xAxisData.push('A' + i);
  data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
  data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
}
option2 = {
  title: {
    text: '资源使用情况'
  },
  backgroundColor:"transparent",
  legend: {
    data: ['模型', '数据']
  },
  toolbox: {
    // y: 'bottom',
    feature: {
      magicType: {
        type: ['stack']
      },
      dataView: {},
      saveAsImage: {
        pixelRatio: 2
      }
    }
  },
  tooltip: {},
  xAxis: {
    data: xAxisData,
    splitLine: {
      show: false
    }
  },
  yAxis: {},
  series: [
    {
      name: '模型',
      type: 'bar',
      data: data1,
      emphasis: {
        focus: 'series'
      },
      animationDelay: function (idx) {
        return idx * 10;
      }
    },
    {
      name: '数据',
      type: 'bar',
      data: data2,
      emphasis: {
        focus: 'series'
      },
      animationDelay: function (idx) {
        return idx * 10 + 100;
      }
    }
  ],
  animationEasing: 'elasticOut',
  animationDelayUpdate: function (idx) {
    return idx * 5;
  }
};
option2 && myChart2.setOption(option2);
}, 2000);
</script>

<style lang="less" scoped>
@beside-bg: rgba(40, 40, 40, 0.5);
.container {
  backdrop-filter: blur(5px);
  .flowbtn {
    height: 5vh;
    width: 16%;
    margin-right: 4.5%;
    font-size: 1.1vw;
  }
  .triangle {
    position: absolute;
    left: 33vw;
    bottom: 9.8vh;
    width: 32.5vw;
    z-index: 2;
    // background: rgba(68, 68, 68, 0.5);
    // backdrop-filter: blur(5px);
    border-radius: 5%;
    // opacity: 0.8;
    // transform: perspective(1200px) rotateY(-25deg);
  }
  .data-charts {
    position: absolute;
    height: 65vh;
    width: 22vw;
    background: @beside-bg;
    right: 1vw;
    top: 25vh;
    padding:10px;
    z-index: 2;
    border-radius: 5%;
    transform: scale(1) perspective(1200px) rotateY(-15deg);
  }
  h1 {
    color: white;
    font-size: 2.24vw;
    text-align: center;
  }
  position: absolute;
  height: 100%;
  width: 100%;
  background: url("../../assets/starfield.jpg");
  background-size: 100% 100%;
  .position-absolute {
    position: absolute !important;
  }
  .width-full {
    width: 100% !important;
  }
  .z-1 {
    z-index: 1 !important;
  }
  svg:not(:root) {
    overflow: hidden;
  }
}
.container .desContainer {
  background: @beside-bg;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  z-index: 2;
  left: 1vw;
  top: 25vh;
  width: 18.55vw;
  height: 65vh;
  transition: all 1s;
  padding: 20px 20px;
    border-radius: 5%;
  transform: scale(1) perspective(1200px) rotateY(15deg);
  h1 {
    color: white;
    font-size: 3.75vw;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: center;
  }
  p {
    // margin-top: -10px;
    font-size: 1.1vw;
    color: white;
    line-height: 170%;
    width: 100%;
  }
  /deep/ .login {
    display: flex;
    align-items: center;
    width: 100%;
    opacity: 1;
    .el-button--primary {
      font-size: 1.15vw;
      // width: 6.25vw;
      height: 4.5vh;
    }
    .el-input__inner {
      font-size: 0.94vw;
      width: 23.95vw !important;
      height: 4.26vh;
    }
  }
  // &:hover {
  //   transform:  translateX(50px) scale(1.05);
  // }
}
.container .merge-earth {
  position: absolute;
  left: 10vw;
  top: 20%;
  // bottom: 50px;
  width: 84vw;
  height: $width;
  z-index: 1;
  backdrop-filter: blur(2px);
}
@value:100vw / 100px;
.container .earth {
  position: absolute;
  left: 5vw;
  top: 5%;
  // bottom: 50px;
  // width: 39.06vw;
  width: 90vw;
  height: $width;
  z-index: 0;
  // background-color: red;
  transition: all 1s;
  transform-origin: 50% 0%;

  // transform: scale(e(replace("@{value}", vw, '')));
  // &:hover {
  // transform: translate(-50px,50px) scale(1.35);
  // }
}
// 兼容css
@right-color: hsla(351, 73%, 22%, 0);
@base-color: hsl(238, 100%, 95%);
@left-color: hsla(190, 90%, 20%, 0);
@introduce-background: hsla(210, 80%, 50%, 0.55);
.home1 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // animation: gradients 6s linear infinite alternate;
  // https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.jiemian.com%2F101%2Foriginal%2F20200925%2F160101930086874400.jpg&refer=http%3A%2F%2Fimg1.jiemian.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653721526&t=987f7aabf97094519e7403f41e361028
  // background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.xhby.net%2Findex%2F202110%2FW020211014807713025533.jpg&refer=http%3A%2F%2Fwww.xhby.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653806992&t=cfa997108f4a23626f2251cf239cc2cd");
  padding-left: 0px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.map {
  position: absolute;
  right: 120px;
  top: 100px;
  height: 700px;
  width: 700px;
  z-index: 5;
  box-shadow: 0 2px 24px 0 hsla(220, 50%, 10%, 0.8);
  transition: all 1s;
  transform: perspective(1500px) rotateY(0deg);
  opacity: 0.85;
  &:hover {
    height: 800px;
    opacity: 0.95;
    width: 800px;
    right: 240px;
    transform: perspective(1000px) rotateY(-2deg) scale(1.05);
  }
}
.introduce {
  position: relative;
  margin-top: 13%;
  left: 120px;
  font-size: 29px !important;
  box-shadow: 0 2px 24px 0 hsla(220, 50%, 10%, 0.8);
  opacity: 1;
  width: 32.5%;
  backdrop-filter: blur(0px);
  color: hsla(210, 80%, 100%, 1);
  padding: 20px;
  background-color: hsla(210, 80%, 50%, 0.65);
  transition: all 1s;
  transform: scale(1) perspective(1500px) rotateY(0deg);
}
.introduce:hover {
  backdrop-filter: blur(10px);
  background-color: hsla(210, 80%, 50%, 0.65);
  color: hsla(210, 80%, 95%, 1);
  transform: translateX(200px) scale(1.15) perspective(1200px) rotateY(2deg);
}
.show_ani {
  animation: show1 0.8s linear 1;
}
.hide_ani {
  display: none;
  animation: hide1 0.8s linear forwards;
}
.earth {
  position: absolute;
  top: 70px;
  right: 0%;
  width: 800px;
  height: 800px;
}

@keyframes show1 {
  0% {
    opacity: 0;
    // transform: scale(0.9);
    display: none;
    // transform: skew(30deg);
  }
  100% {
    display: block;
    // -webkit-transform: scale3d(1, 1, 1);
    // transform: skew(0deg);
  }
}
@keyframes hide1 {
  0% {
    // transform: scale(1);
  }

  100% {
    opacity: 0;
    // transform: scale(0.9);
    display: none;
  }
}

#main1{
  width: 100%;
  height: 50%;
}
#main2{
  width: 100%;
  height: 50%;
}
.border-box {
  color: white;
  position: relative;
  // margin:300px auto;
  // width:400px;
  // height:300px;
  padding: 5px 15px 5px 15px;
  // background: rgba(1, 19, 67, 0.8);
  // border: 2px solid #00a1ff;
  background: rgba(73, 73, 73, 0.8);
  border: 2px solid #ffffff;
  border-radius: 8px;
}
.border-box::before {
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: 30px;
  width: calc(100% - 60px);
  content: "";
  // border-top: 2px solid #016886;
  // border-bottom: 2px solid #016886;
  border-top: 2px solid #707070;
  border-bottom: 2px solid #818181;
  z-index: 0;
}
.border-box::after {
  position: absolute;
  top: 15px;
  right: -2px;
  left: -2px;
  height: calc(100% - 30px);
  content: "";
  // border-right: 2px solid #016886;
  // border-left: 2px solid #016886;
  border-right: 2px solid #8b8b8b;
  border-left: 2px solid #8d8d8d;
  z-index: 0;
}
.border-box p {
  line-height: 100px;
  text-align: center;
  color: #00a1ff;
}
</style>

