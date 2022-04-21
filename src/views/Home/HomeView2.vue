<template>
  <div style="position: relative; display: flex" class="home2">
    <ProblemCharts
      :class="{ hide_ani: !props.show, show_ani: props.show }"
      class="sunburst"
      @sendProblem="recieveProblem"
    ></ProblemCharts>
    <VisibalSpan
      ref="visibility"
      :data="new_data"
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
  pic: "https://img2.baidu.com/it/u=4014285563,2591904440&fm=253&fmt=auto&app=138&f=PNG?w=500&h=208",
});
const props = defineProps({
  show: Boolean,
});
const recieveProblem = (name) => {
  visibility.value.scrollingSpan();
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
  right: 5px;
  width: 900px;
  height: 1050px;
  top: 0px;
  backdrop-filter: blur(3px);
  background-color: hsla(230, 100%, 70%, 0.08);
  opacity: 0;
  z-index: 2;
}
.visible {
  position: absolute;
  top: 0;
  left: 0;
  width: 1100px;
  height: 800px;
  z-index: 1;
}
.home2 {
  background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbkimg.cdn.bcebos.com%2Fpic%2Ffc1f4134970a304e30930d83d8c8a786c9175c11&refer=http%3A%2F%2Fbkimg.cdn.bcebos.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652859702&t=af97a9f3e0d302cee16f67133e5c1ed4");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.hide_ani {
  animation: hide1 1s linear forwards 0.1s;
}
.show_ani {
  animation: show1 1s linear forwards 0.1s;
}
@keyframes hide1 {
  0% {
    transform: translateX(0px) scale(1);
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(-300px) scale(0.1);
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