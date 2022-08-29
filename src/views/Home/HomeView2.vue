<template>
  <div style="position: relative; display: flex" class="home2">
    <img src="../../assets/problem_small.png" alt="" class="img-pro" />
    <ProblemCharts
     
      class="sunburst"
      @sendProblem="recieveProblem"
    ></ProblemCharts>
    <VisibalSpan
      ref="visibility"
      :new_data="new_data"
      :class="{ hide_ani: !props.show, show_ani: props.show }"
      class="visible"
    ></VisibalSpan>
    <!-- <img
      class="img-bg"
      :class="{ hide_ani: !props.show, show_ani: props.show }"
      src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.vjshi.com%2F2018-12-06%2Fa6abae7edf699783cc97fea1c3d59913%2F00003.jpg%3Fx-oss-process%3Dstyle%2Fwatermark&refer=http%3A%2F%2Fpic.vjshi.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656569246&t=face99307646b24b69dabccc55627cf4"
      alt=""
    /> -->
    <!-- <div class="custom-shape-divider-bottom-1656508867"> -->
    <!-- <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
    </svg> -->
    <!-- </div> -->
    <svg
      width="100%"
      height="100%"
      id="svg"
      viewBox="0 0 1440 350"
      xmlns="http://www.w3.org/2000/svg"
      class="transition duration-300 ease-in-out delay-150"
    >

      <defs>
        <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="5%" stop-color="#002bdc88"></stop>
          <stop offset="95%" stop-color="#0693e388"></stop>
        </linearGradient>
      </defs>
      <path
        d="M 0,600 C 0,600 0,200 0,200 C 79.17179487179487,175.86923076923074 158.34358974358975,151.7384615384615 228,178 C 297.65641025641025,204.2615384615385 357.7974358974359,280.91538461538465 437,269 C 516.2025641025641,257.08461538461535 614.4666666666668,156.59999999999997 708,137 C 801.5333333333332,117.40000000000003 890.3358974358973,178.6846153846154 981,187 C 1071.6641025641027,195.3153846153846 1164.1897435897436,150.66153846153847 1241,144 C 1317.8102564102564,137.33846153846153 1378.9051282051282,168.66923076923075 1440,200 C 1440,200 1440,600 1440,600 Z"
        stroke="none"
        stroke-width="0"
        fill="url(#gradient)"
        class="transition-all duration-300 ease-in-out delay-150 path-0"
      ></path>

      <defs>
        <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="5%" stop-color="#002bdcff"></stop>
          <stop offset="95%" stop-color="#8ed1fcff"></stop>
        </linearGradient>
      </defs>
      <path
        d="M 0,600 C 0,600 0,400 0,400 C 65.88717948717948,381.5153846153846 131.77435897435896,363.03076923076924 212,374 C 292.22564102564104,384.96923076923076 386.7897435897437,425.3923076923077 479,420 C 571.2102564102563,414.6076923076923 661.0666666666667,363.4 739,363 C 816.9333333333333,362.6 882.9435897435897,413.00769230769237 955,430 C 1027.0564102564103,446.99230769230763 1105.1589743589743,430.5692307692307 1187,420 C 1268.8410256410257,409.4307692307693 1354.4205128205128,404.71538461538466 1440,400 C 1440,400 1440,600 1440,600 Z"
        stroke="none"
        stroke-width="0"
        fill="url(#gradient)"
        class="transition-all duration-300 ease-in-out delay-150 path-1"
      ></path>
    </svg>
  </div>
</template>

<script setup>
import ProblemCharts from "components/Home/ProblemCharts.vue";
import VisibalSpan from "components/Home/VisibleSpan.vue";
import { ElMessage } from "element-plus";
import { defineProps, ref, watch } from "vue";
const new_data = ref({
  name: "4444",
  pic: null,
  des: "",
});
const props = defineProps({
  show: Boolean,
});
watch(
  () => props.show,
  (newval, oldval) => {
    if (newval) {
      setTimeout(()=>{
        document.getElementsByClassName("bg")[0].style.display = "none";
      // document.getElementsByClassName("container")[0].style.background =
      //   "hsl(206, 100%, 42%)";
       document.getElementsByClassName("container")[0].style.background =
        "transparent";
        document.getElementsByClassName("bg_pro")[0].style.opacity =
        "1";
      },200)
      
    } else {
setTimeout(()=>{
      document.getElementsByClassName("bg")[0].style.display = "block";
      document.getElementsByClassName("container")[0].style.background =
        "#24292f3b";
        document.getElementsByClassName("bg_pro")[0].style.opacity =
        "0";
        },500)
    }
  }
);
const recieveProblem = (name, path, des) => {
  new_data.value.pic = require("@/" + path);
  new_data.value.des = des;
  new_data.value.name = name;
  visibility.value.scrollingSpan();

  ElMessage({
    message: name,
    type: "success",
  });
};
const visibility = ref();
</script>

<style lang="less" scoped>
@hover-time: 2s;
// @randomNum: `Math.ceil(Math.random() * 60) -30`;
@randomNum:30;
.randMove() {
  animation: floating calc((abs(@randomNum / 2) + 20) * 1s) ease-in-out infinite
    alternate;
  @keyframes floating {
    0% {
      transform: translate(-@randomNum*1px, -@randomNum*1px);
    }
    25% {
      transform: translate(-@randomNum*1px, @randomNum*1px);
    }
    50% {
      transform: translate(-@randomNum*1px, -@randomNum*1px);
    }
    75% {
      transform: translate(@randomNum*1px, @randomNum*1px);
    }
    100% {
      transform: translate(@randomNum*1px, -@randomNum*1px);
    }
  }
}
.img-pro {
  position: absolute;
  right: calc(4vw - 1px);
  top: 15%;
  width: 2.8vw;
  height: $width * 1.5;
  .randMove();
  z-index: 0;
}
.sunburst {
  position: absolute;
  right: 0px;
  width: 880px;
  height: $width;
  top: 7%;
  //   backdrop-filter: blur(3px);
  //   background-color: hsla(230, 100%, 70%, 0.08);
  opacity: 0.9;
  z-index: 2;
  transform-origin: 100% 0;
  transform: perspective(1500px) rotateY(-2deg) scale(1);
  transition: all @hover-time;
}
.sunburst:hover {
  opacity: 0.95;
  transform: rotateY(0deg);
}
.visible {
  position: absolute;
  top: 15%;
  left: 20px;
  width: 39.06vw;
  height: $width * 0.8;
  z-index: 1;
  opacity: 1;
  transition: all @hover-time;
  background-color: hsla(207, 93%, 62%, 0);
  transform: translateX(30px) perspective(1500px) rotateY(0deg) !important;
  // &:hover {
  //   top: 20%;
  //   left: 120px;

  //   background-color: hsla(207,93%,62%,0);
  //   // backdrop-filter: blur(10px);
  //   transform: scale(1.2) translateX(0px) perspective(1500px) rotateY(2deg) !important;
  // }
}
.home2 {
  // background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.vjshi.com%2F2018-12-06%2Fa6abae7edf699783cc97fea1c3d59913%2F00003.jpg%3Fx-oss-process%3Dstyle%2Fwatermark&refer=http%3A%2F%2Fpic.vjshi.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656569246&t=face99307646b24b69dabccc55627cf4");
  background-size: 100% 100%;
  background-color: hsl(196, 87%, 100%);
  background-repeat: no-repeat;
overflow: hidden;
  // background-position: 110% -5%;
}
.img-bg {
  position: absolute;
  filter: saturate(100%) brightness(85%) blur(5px);
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}
.hide_ani {
  display: none;
  animation: hide1 0.8s linear forwards;
}
.show_ani {
  animation: show1 0.8s linear 1;
}
@keyframes hide1 {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    // transform: scale(0.9);
    display: none;
  }
}
@keyframes show1 {
  0% {
    opacity: 0;
    // transform: scale(0.9);
    
    // transform: skew(30deg);
  }

  100% {
    opacity: 1;
    display: block;
    // -webkit-transform: scale3d(1, 1, 1);
    // transform: skew(0deg);
  }
}
.custom-shape-divider-bottom-1656508867 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.custom-shape-divider-bottom-1656508867 svg {
  position: relative;
  display: block;
  width: calc(223% + 1.3px);
  height: 37vh;
}

.custom-shape-divider-bottom-1656508867 .shape-fill {
  fill: hsl(196, 100%, 49%);
}

 .path-0 {
          animation: pathAnim-0 16s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes pathAnim-0 {
          0% {
            d: path(
              "M 0,600 C 0,600 0,200 0,200 C 79.17179487179487,175.86923076923074 158.34358974358975,151.7384615384615 228,178 C 297.65641025641025,204.2615384615385 357.7974358974359,280.91538461538465 437,269 C 516.2025641025641,257.08461538461535 614.4666666666668,156.59999999999997 708,137 C 801.5333333333332,117.40000000000003 890.3358974358973,178.6846153846154 981,187 C 1071.6641025641027,195.3153846153846 1164.1897435897436,150.66153846153847 1241,144 C 1317.8102564102564,137.33846153846153 1378.9051282051282,168.66923076923075 1440,200 C 1440,200 1440,600 1440,600 Z"
            );
          }
          25% {
            d: path(
              "M 0,600 C 0,600 0,200 0,200 C 90.70000000000002,231.07179487179488 181.40000000000003,262.14358974358976 267,272 C 352.59999999999997,281.85641025641024 433.0999999999999,270.49743589743593 502,253 C 570.9000000000001,235.5025641025641 628.2,211.86666666666667 701,181 C 773.8,150.13333333333333 862.1000000000001,112.03589743589743 953,135 C 1043.8999999999999,157.96410256410257 1137.3999999999999,241.98974358974363 1219,263 C 1300.6000000000001,284.0102564102564 1370.3000000000002,242.0051282051282 1440,200 C 1440,200 1440,600 1440,600 Z"
            );
          }
          50% {
            d: path(
              "M 0,600 C 0,600 0,200 0,200 C 88.5025641025641,171.2948717948718 177.0051282051282,142.5897435897436 245,158 C 312.9948717948718,173.4102564102564 360.48205128205126,232.9358974358974 435,251 C 509.51794871794874,269.0641025641026 611.0666666666666,245.6666666666667 712,248 C 812.9333333333334,250.3333333333333 913.251282051282,278.39743589743586 999,265 C 1084.748717948718,251.60256410256414 1155.928205128205,196.74358974358978 1227,179 C 1298.071794871795,161.25641025641022 1369.0358974358974,180.6282051282051 1440,200 C 1440,200 1440,600 1440,600 Z"
            );
          }
          75% {
            d: path(
              "M 0,600 C 0,600 0,200 0,200 C 65.23333333333332,152.67692307692306 130.46666666666664,105.35384615384615 204,125 C 277.53333333333336,144.64615384615385 359.3666666666668,231.26153846153846 442,260 C 524.6333333333332,288.73846153846154 608.0666666666666,259.59999999999997 704,248 C 799.9333333333334,236.40000000000003 908.3666666666668,242.3384615384615 982,253 C 1055.6333333333332,263.6615384615385 1094.4666666666667,279.04615384615386 1165,271 C 1235.5333333333333,262.95384615384614 1337.7666666666667,231.47692307692307 1440,200 C 1440,200 1440,600 1440,600 Z"
            );
          }
          100% {
            d: path(
              "M 0,600 C 0,600 0,200 0,200 C 79.17179487179487,175.86923076923074 158.34358974358975,151.7384615384615 228,178 C 297.65641025641025,204.2615384615385 357.7974358974359,280.91538461538465 437,269 C 516.2025641025641,257.08461538461535 614.4666666666668,156.59999999999997 708,137 C 801.5333333333332,117.40000000000003 890.3358974358973,178.6846153846154 981,187 C 1071.6641025641027,195.3153846153846 1164.1897435897436,150.66153846153847 1241,144 C 1317.8102564102564,137.33846153846153 1378.9051282051282,168.66923076923075 1440,200 C 1440,200 1440,600 1440,600 Z"
            );
          }
        }
         .path-1 {
          animation: pathAnim-1 12s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes pathAnim-1 {
          0% {
            d: path(
              "M 0,600 C 0,600 0,400 0,400 C 65.88717948717948,381.5153846153846 131.77435897435896,363.03076923076924 212,374 C 292.22564102564104,384.96923076923076 386.7897435897437,425.3923076923077 479,420 C 571.2102564102563,414.6076923076923 661.0666666666667,363.4 739,363 C 816.9333333333333,362.6 882.9435897435897,413.00769230769237 955,430 C 1027.0564102564103,446.99230769230763 1105.1589743589743,430.5692307692307 1187,420 C 1268.8410256410257,409.4307692307693 1354.4205128205128,404.71538461538466 1440,400 C 1440,400 1440,600 1440,600 Z"
            );
          }
          25% {
            d: path(
              "M 0,600 C 0,600 0,400 0,400 C 81.78974358974361,358.4846153846154 163.57948717948722,316.96923076923076 246,335 C 328.4205128205128,353.03076923076924 411.4717948717948,430.6076923076923 478,464 C 544.5282051282052,497.3923076923077 594.5333333333335,486.6 675,466 C 755.4666666666665,445.4 866.3948717948717,414.9923076923077 969,403 C 1071.6051282051283,391.0076923076923 1165.8871794871795,397.4307692307692 1243,400 C 1320.1128205128205,402.5692307692308 1380.0564102564103,401.2846153846154 1440,400 C 1440,400 1440,600 1440,600 Z"
            );
          }
          50% {
            d: path(
              "M 0,600 C 0,600 0,400 0,400 C 92.01538461538462,395.0076923076923 184.03076923076924,390.0153846153847 256,397 C 327.96923076923076,403.9846153846153 379.89230769230767,422.94615384615383 449,433 C 518.1076923076923,443.05384615384617 604.4,444.2 702,444 C 799.6,443.8 908.5076923076924,442.2538461538462 996,435 C 1083.4923076923076,427.7461538461538 1149.569230769231,414.7846153846154 1220,408 C 1290.430769230769,401.2153846153846 1365.2153846153847,400.60769230769233 1440,400 C 1440,400 1440,600 1440,600 Z"
            );
          }
          75% {
            d: path(
              "M 0,600 C 0,600 0,400 0,400 C 96.11025641025643,413.4641025641026 192.22051282051285,426.92820512820515 277,426 C 361.77948717948715,425.07179487179485 435.2282051282051,409.7512820512821 519,416 C 602.7717948717949,422.2487179487179 696.8666666666667,450.06666666666666 759,440 C 821.1333333333333,429.93333333333334 851.3051282051283,381.98205128205126 919,353 C 986.6948717948717,324.01794871794874 1091.9128205128204,314.00512820512824 1185,325 C 1278.0871794871796,335.99487179487176 1359.0435897435898,367.9974358974359 1440,400 C 1440,400 1440,600 1440,600 Z"
            );
          }
          100% {
            d: path(
              "M 0,600 C 0,600 0,400 0,400 C 65.88717948717948,381.5153846153846 131.77435897435896,363.03076923076924 212,374 C 292.22564102564104,384.96923076923076 386.7897435897437,425.3923076923077 479,420 C 571.2102564102563,414.6076923076923 661.0666666666667,363.4 739,363 C 816.9333333333333,362.6 882.9435897435897,413.00769230769237 955,430 C 1027.0564102564103,446.99230769230763 1105.1589743589743,430.5692307692307 1187,420 C 1268.8410256410257,409.4307692307693 1354.4205128205128,404.71538461538466 1440,400 C 1440,400 1440,600 1440,600 Z"
            );
          }
        }
</style>