<template>
  <div ref="home1" class="home1">
    <div class="container">
      <h1
        style="
          margin-top: 3.75%;
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
        "
      >
        <!--        <span style="background: transparent" class="border-box">长三角综合模拟器</span>-->
        <dv-border-box8 dur="3" style="width: 33%; padding: 3px"
          >长三角虚拟地理实验平台</dv-border-box8
        >
      </h1>
      <div
        style="
          position: absolute;
          width: 100vw;
          height: 5vh;
          top: 17vh;
          z-index: 2;
          display: flex;
          justify-content: space-around;
        "
      >
        <div size="large" class="border-box flowbtn">流域水循环及驱动机制</div>
        <div size="large" class="border-box flowbtn">
          全球变化与区域环境演化
        </div>
        <div size="large" class="border-box flowbtn">
          城市化与人地关系协调发展
        </div>
        <div
          size="large"
          class="border-box flowbtn"
          style="margin-right: 0 !important"
        >
          灾害响应与治理
        </div>
      </div>

      <div
        class="desContainer"
        :class="{ show_ani: props.show, hide_ani: !props.show }"
      >
        <el-divider style="margin: 5px 0 5px 0"></el-divider>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长三角虚拟地理实验平台是以长三角区域为研究对象，以区域发展问题为驱动，将自然地理过程和社会经济过程相耦合的虚拟地理环境模拟和实验平台；强调了大气、陆面和海洋之间的循环演变，自然和城市之间的互联互动，学科之间的深度交叉；具有汇聚模拟资源、构建模拟模型和开展模型实验三大功能，可应用于地理过程模拟、自然灾害预报和综合决策制定多个领域，服务于长三角高质量一体化发展国家战略。
        </p>
        <el-divider style="margin: 15px 0 -5px 0"></el-divider>
        <div class="login">
          <!-- <el-input
            v-model="input"
            type="password"
            placeholder="邮件地址"
            show-password
          /> -->

          <button
            @click="toSci()"
            class="button-87"
            style="margin-top: 3vh; width: 100%"
            type="primary"
          >
            <el-icon><Bottom /></el-icon>&nbsp;探索科学专题
          </button>
        </div>
      </div>
      <div class="data-charts">
        <div id="main1"></div>
        <div id="main2"></div>
      </div>
      <div class="merge-earth"></div>
      <MapCharts class="earth"></MapCharts>
      <img class="triangle" src="../../assets/triangle.png" alt="" />
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
   
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MapCharts from "components/Home/MapCharts.vue";
import * as echarts from "echarts";
import { Decrypt } from "@/util/codeUtil";
import axios from "axios";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const dataServer = store.getters.devIpAddress;
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
let hotsearchData = [];
const getHotsearchList = () => {
  return axios({
    url: dataServer + "/getResByDataView",
    method: "get",
  }).then(
    (res) => {
      hotsearchData = res.data.data;
      console.log(hotsearchData);
    },
    (err) => {
      console.log(err);
    }
  );
};
getHotsearchList();
const dataInterval = [0, 1, 5, 50, 200, 1000, 5000, 12000];
let resourceNum_ori = [0, 0, 0, 0];
let resourceModelNum_ori = [0, 0, 0, 0];
let resourceNum = [0, 0, 0, 0];
let resourceModelNum = [0, 0, 0, 0];
const restoreNum = (num) => {
  let i = resourceNum.indexOf(num);
  if (i == -1) {
    i = resourceModelNum.indexOf(num);
    return resourceModelNum_ori[i];
  } else {
    return resourceNum_ori[i];
  }
  //  let y_value =
  //         ((resourceModelNum[i] - min_v) / (max_v - min_v)) * 10 + index * 10;
  // ((x- index * 10)/ 10)*(max_v - min_v)+ min_v = num   ;
};
setTimeout(() => {
  let allResourceNum = localStorage.getItem("allResourceNum");

  if (allResourceNum) {
    allResourceNum = JSON.parse(Decrypt(allResourceNum));
    resourceNum[0] = allResourceNum.disasterNum;
    resourceNum[1] = allResourceNum.globalNum;
    resourceNum[2] = allResourceNum.riverNum;
    resourceNum[3] = allResourceNum.cityNum;
    resourceNum_ori[0] = allResourceNum.disasterNum;
    resourceNum_ori[1] = allResourceNum.globalNum;
    resourceNum_ori[2] = allResourceNum.riverNum;
    resourceNum_ori[3] = allResourceNum.cityNum;
    resourceModelNum[0] = allResourceNum.disasterModelNum;
    resourceModelNum[1] = allResourceNum.globalModelNum;
    resourceModelNum[2] = allResourceNum.riverModelNum;
    resourceModelNum[3] = allResourceNum.cityModelNum;
    resourceModelNum_ori[0] = allResourceNum.disasterModelNum;
    resourceModelNum_ori[1] = allResourceNum.globalModelNum;
    resourceModelNum_ori[2] = allResourceNum.riverModelNum;
    resourceModelNum_ori[3] = allResourceNum.cityModelNum;

    for (let i = 0; i < resourceNum.length; i++) {
      // 1.寻找在数据间隔里小于Data的最大值
      let min_v = Math.max(...dataInterval.filter((v) => v <= resourceNum[i]));
      // 2.寻找在数据间隔里大于Data的最小值
      let max_v = Math.min(...dataInterval.filter((v) => v > resourceNum[i]));
      //  3.寻找 min_v 所在的下标
      let index = dataInterval.findIndex((v) => v === min_v);
      //  4.计算该Data在y轴上应该展示的位置
      let y_value =
        ((resourceNum[i] - min_v) / (max_v - min_v)) * 10 + index * 10;
      resourceNum[i] = y_value;
    }
    for (let i = 0; i < resourceNum.length; i++) {
      // 1.寻找在数据间隔里小于Data的最大值
      let min_v = Math.max(
        ...dataInterval.filter((v) => v <= resourceModelNum[i])
      );
      // 2.寻找在数据间隔里大于Data的最小值
      let max_v = Math.min(
        ...dataInterval.filter((v) => v > resourceModelNum[i])
      );
      //  3.寻找 min_v 所在的下标
      let index = dataInterval.findIndex((v) => v === min_v);
      //  4.计算该Data在y轴上应该展示的位置
      let y_value =
        ((resourceModelNum[i] - min_v) / (max_v - min_v)) * 10 + index * 10;
      resourceModelNum[i] = y_value;
    }
  }

  var chartDom1 = document.getElementById("main1");
  var myChart1 = echarts.init(chartDom1, "dark");
  var option1;
  option1 = {
    title: {
      text: "资源分布情况",
    },
    toolbox: {
      // y: 'bottom',
      feature: {
        magicType: {
          type: ["stack"],
        },
        dataView: {},
        saveAsImage: {
          pixelRatio: 2,
        },
      },
    },
    tooltip: {
      // 鼠标悬浮提示框显示 X和Y 轴数据
      // trigger: "axis",
      // backgroundColor: "rgba(32, 33, 36,.7)",
      // borderColor: "rgba(32, 33, 36,0.20)",
      // borderWidth: 1,
      // textStyle: {
      //   // 文字提示样式
      //   color: "#fff",
      //   fontSize: "12",
      // },
      axisPointer: {
        // 坐标轴虚线
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
          show:false,
          // formatter: (params) => {
          //   return String(restoreNum(params.value));
          // },
        },
      },
      formatter: (params) => {
        return params.name.replace('\n','')+"-"+params.seriesName + "：" + String(restoreNum(params.value)) + "条";
      },
    },

    angleAxis: {
      type: "category",
      data: [
        "灾害响应与治理",
        "全球变化与\n区域环境演化",
        "流域水循环\n及其驱动机制",
        "城市化与人地关系\n协调发展",
      ],
    },
    radiusAxis: {
      type: "value",
      scale: true,
      // minInterval:1,
      // maxInterval:1000,
      axisLabel: {
        //v值 i系统分层值
        formatter: (v, i) => {
          if (i === 0) {
            v = String(dataInterval[i]);
          }
          if (i === 1) {
            v = String(dataInterval[i]);
          }
          if (i === 2) {
            v = String(dataInterval[i]);
          }
          if (i === 3) {
            v = String(dataInterval[i]);
          }
          if (i === 4) {
            v = String(dataInterval[i]);
          }
          if (i === 5) {
            v = String(dataInterval[i]);
          }
          if (i === 6) {
            v = String(dataInterval[i]);
          }
          if (i === 7) {
            v = String(dataInterval[i]);
          }
          return v;
        },
      },
    },
    polar: {},
    backgroundColor: "transparent",
    series: [
      {
        type: "bar",
        data: resourceModelNum,
        coordinateSystem: "polar",
        name: "模型",
        // stack: "a",
        itemStyle:{
          opacity:"0.75"
        },
        // emphasis: {
        //   focus: "series",
        // },
      },
      {
        type: "bar",
        data: resourceNum,
        coordinateSystem: "polar",
        name: "数据",
        itemStyle:{
          opacity:"0.65"
        },
        // label: {
        //   formatter: (params) => {
        //     return params.value * 2;
        //   },
        // },

        // stack: "a",
        // emphasis: {
        //   focus: "series",
        // },
      },
    ],
    legend: {
      show: true,
      data: ["模型", "数据"],
      selectedMode: false,
    },
  };

  option1 && myChart1.setOption(option1);

  var chartDom2 = document.getElementById("main2");
  var myChart2 = echarts.init(chartDom2, "dark");
  var option2;
  var xAxisData = [];
  var data1 = [];
  var data2 = [];
  for (let i in hotsearchData) {
    data2.push(hotsearchData[i].pageviews);
    xAxisData.push(hotsearchData[i].name);
  }
  option2 = {
    title: {
      text: "资源使用热点",
    },
    backgroundColor: "transparent",
    legend: {
      selectedMode: false,
      data: ["数据"],
    },
    toolbox: {
      // y: 'bottom',
      feature: {
        magicType: {
          type: ["stack"],
        },
        dataView: {},
        saveAsImage: {
          pixelRatio: 2,
        },
      },
    },
    tooltip: {
      axisPointer: {
        // 坐标轴虚线
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    xAxis: {
      data: xAxisData,
      splitLine: {
        show: false,
      },
    },
    yAxis: {},
    series: [
      // {
      //   name: "模型",
      //   type: "bar",
      //   data: data1,
      //   emphasis: {
      //     focus: "series",
      //   },
      //   animationDelay: function (idx) {
      //     return idx * 10;
      //   },
      // },
      {
        name: "数据",
        type: "bar",
        data: data2,
        emphasis: {
          focus: "series",
        },
        animationDelay: function (idx) {
          return idx * 10 + 100;
        },
      },
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: function (idx) {
      return idx * 5;
    },
  };
  option2 && myChart2.setOption(option2);
}, 2000);
</script>

<style lang="less" scoped>
@beside-bg: rgba(40, 40, 40, 0.5);

/* CSS */
.button-87 {
  font-size: 1vw;
  margin: 10px;
  padding: 10px 10px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color:#fafafa;
  border-radius: 10px;
  display: block;
  border: 0px;
  font-weight: 700;
  box-shadow: 0px 0px 14px -7px #0093e9;
  background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-87:hover {
  background-position: right center;
  /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}

.button-87:active {
  transform: scale(0.95);
}
.container {
  backdrop-filter: blur(5px);
  .flowbtn {
    height: 5vh;
    width: 16%;
    margin-right: 4.5%;
    font-size: 1.1vw;
    display: flex;
    justify-content: center;
    cursor: text;
  }
  .triangle {
    position: absolute;
    left: 33vw;
    bottom: 7vh;
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
    padding: 10px;
    z-index: 2;
    border-radius: 5%;
    transform: scale(1) perspective(1200px) rotateY(-15deg);
  }
  h1 {
    color:#fafafa;
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
  width: 20.55vw;
  max-width: 23.55vw;
  height: 65vh;
  transition: all 1s;
  padding: 20px 20px;
  border-radius: 5%;
  transform: scale(1) perspective(1200px) rotateY(15deg);
  h1 {
    color:#fafafa;
    font-size: 3.75vw;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: center;
  }
  p {
    // margin-top: -10px;
    font-size: 1.1vw;
    color:#fafafa;
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

#main1 {
  width: 100%;
  height: 50%;
}
#main2 {
  width: 100%;
  height: 50%;
}
.border-box {
  color:#fafafa;
  position: relative;
  // margin:300px auto;
  // width:400px;
  // height:300px;
  padding: 5px 15px 5px 15px;
  // background: rgba(1, 19, 67, 0.8);
  // border: 2px solid #00a1ff;
  background: rgba(1, 19, 67, 0.5);
  border: 2px solid rgba(100, 207, 220);
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
  border-top: 2px solid #016886;
  border-bottom: 2px solid #016886;
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
  border-right: 2px solid #016886;
  border-left: 2px solid #016886;
  z-index: 0;
}
.border-box p {
  line-height: 100px;
  text-align: center;
  color: #00a1ff;
}
</style>

