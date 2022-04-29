<template>
  <div style="position: relative; display: flex" class="home2">
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
.sunburst {
  position: absolute;
  right: -105px;
  width: 900px;
  height: 900px;
  top: 30px;
  //   backdrop-filter: blur(3px);
  //   background-color: hsla(230, 100%, 70%, 0.08);
  opacity: 0.75;
  z-index: 2;
  transform: perspective(1000px) rotateY(-20deg) scale(0.9) !important;
  transition: all 1s;
}
.sunburst:hover {
    opacity: 0.95;
  right: 95px;
  transform: perspective(1000px) rotateY(-2deg) scale(1.1) !important;
}
.visible {
  position: absolute;
  top: 8%;
  left: 20px;
  width: 900px;
  height: 700px;
  z-index: 1;
  opacity: 1;
  transition: all 1s;
      background-color: hsla(207,93%,62%,0.1);
  transform: translateX(30px) perspective(1500px) rotateY(15deg) !important;
  &:hover {
    top: 10%;
    left: 120px;
    height: 800px;
    width: 1100px;
    background-color: hsla(207,93%,62%,0.6);
    backdrop-filter: blur(10px);
    transform: translateX(0px) perspective(1500px) rotateY(2deg) !important;
  }
}
.home2 {
  background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcmszfb.oss-cn-beijing.aliyuncs.com%2Fu%2Fcms%2Fwww%2F202101%2F29210836quh0.jpg&refer=http%3A%2F%2Fcmszfb.oss-cn-beijing.aliyuncs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653737379&t=adb2eb53d075b2c1b2f472341ee5a1eb");
  background-size: 100% 100%;
  background-color: hsl(196, 87%, 94%);
  background-repeat: no-repeat;
}
.hide_ani {
  animation: hide1 1s linear forwards;
}
.show_ani {
  animation: show1 1s linear 1;
}
@keyframes hide1 {
  0% {
    transform: translateX(0px) scale(1);
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(300px) scale(0.1);
  }
}
@keyframes show1 {
  0% {
    opacity: 0;
    transform: translateX(-300px) scale(0.1);
    // transform: skew(30deg);
  }

  100% {
    transform: translateX(0px) scale(1);
    opacity: 1;
    // -webkit-transform: scale3d(1, 1, 1);
    // transform: skew(0deg);
  }
}
</style>