<template>
  <div style="position: relative; display: flex" class="home2">
    <img src="../../assets/problem_small.png" alt="" class="img-pro">
    <ProblemCharts
      :class="{ hide_ani: !props.show, show_ani: props.show }"
      class="sunburst"
      @sendProblem="recieveProblem"
    ></ProblemCharts>
    <VisibalSpan
      ref="visibility"
      :new_data="new_data"
      :class="{ hide_ani: !props.show, show_ani: props.show }"
      class="visible"
    ></VisibalSpan>
  </div>
</template>

<script setup>
import ProblemCharts from "components/Home/ProblemCharts.vue";
import VisibalSpan from "components/Home/VisibleSpan.vue";
import { ElMessage } from "element-plus";
import { defineProps, ref } from "vue";
const new_data = ref({
  name: "4444",
  pic: null,
});
const props = defineProps({
  show: Boolean,
});
const recieveProblem = (name, path) => {
  new_data.value.pic = require("@/" + path);

  visibility.value.scrollingSpan();
  console.log(path);

  ElMessage({
    message: name,
    type: "success",
  });
};
const visibility = ref();
</script>

<style lang="less" scoped>
@hover-time:2s;
@randomNum: `Math.ceil(Math.random() * 30) -15`;
.randMove() {
  animation: floating calc((abs(@randomNum / 2) + 20) * 1s) ease-in-out infinite
    alternate;
  @keyframes floating {
    0% {
      transform: translate(0px, 0px);
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
.img-pro{
  position: absolute;
  right: calc(50vw - 70px);
  top: 32px;
  width: 70px;
  height: 105px;
  .randMove();
  z-index: 5;
}
.sunburst {
  position: absolute;
  right: 0px;
  width: 900px;
  height: 900px;
  top: 1%;
  //   backdrop-filter: blur(3px);
  //   background-color: hsla(230, 100%, 70%, 0.08);
  opacity: 0.9;
  z-index: 2;
  transform: perspective(1000px) rotateY(-8deg) scale(1) !important;
  transition: all @hover-time;
}
.sunburst:hover {
    opacity: 0.95;
  transform: perspective(1000px) rotateY(0deg) scale(1) !important;
}
.visible {
  position: absolute;
  top: 15%;
  left: 20px;
  width: 750px;
  height: 600px;
  z-index: 1;
  opacity: 1;
  transition: all @hover-time;
      background-color: hsla(207,93%,62%,0);
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
  // background: url("../../assets/problem.jpg");
  background-size: 25% 30%;
  background-color: hsl(196, 87%, 100%);
  background-repeat: no-repeat;
  background-position:110% -5%;
}
.hide_ani {
  animation: hide1 .8s linear forwards;
}
.show_ani {
  animation: show1 .8s linear 1;
}
@keyframes hide1 {
  0% {
   
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}
@keyframes show1 {
  0% {
    opacity: 0;
    transform: scale(0.9);
    // transform: skew(30deg);
  }

  100% {
   
    opacity: 1;
    // -webkit-transform: scale3d(1, 1, 1);
    // transform: skew(0deg);
  }
}
</style>