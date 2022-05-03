<template>
  <div>
    <div class="whole_span">
      <div
        class="default_span"
        style="opacity: 0; left: -20px"
        :class="{ scroll3: isScroll }"
      >
        <!-- {{ left_data.name }} -->
        <img :src="left_data.pic" class="img" />
        <!-- <div class="left_span"></div> -->
      </div>
      <div class="default_span" :class="{ smallize: isScroll }">
        <!-- {{ main_data.name }} -->
        <div class="blur"></div>
        <img :src="main_data.pic" class="img main-img" />
        <!-- <div class="main_span"></div> -->
      </div>
      <div class="default_span side_span" :class="{ scroll2: isScroll }">
        <!-- {{ right_data.name }} -->
        <img :src="right_data.pic" class="img" />
        <!-- <div class="right_span"></div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineExpose } from "vue";

const props = defineProps({
  new_data: ref(Object),
});

const temp_data = ref({
  name: "4444",
  pic: require("../../assets/problem/流域生态环境演变.png"),
});
const main_data = ref({
  name: "1111",
  pic: require("../../assets/problem/流域生态环境演变.png"),
});
const left_data = ref({
  name: "2222",
  pic: require("../../assets/problem/流域碳水耦合循环.png"),
});
const right_data = ref({
  name: "3333",
  pic: require("assets/problem/地表地下水耦合.png"),
});
const isScroll = ref(false);
const scrollingSpan = () => {
  isScroll.value = true;
  left_data.value.pic = props.new_data.pic;

  let animation_time = 1000;
  setTimeout(() => {
    temp_data.value.pic = right_data.value.pic; //不加.pic则变成object指针变动，而非值的变动
    right_data.value.pic = main_data.value.pic;
    main_data.value.pic = left_data.value.pic;
  }, animation_time);
  setTimeout(() => {
    isScroll.value = false;
    // left_data.value = props.new_data;
  }, animation_time * 1.5 + 50);
};
defineExpose({ scrollingSpan });
//变换逻辑：接受新值，覆盖left，动画完成后，main→right left→main
</script>

<style lang="less" scoped>
@side_scale: 0.3;
@scroll_time: 1s;
@tilt: scale(@side_scale) perspective(1500px) rotateY(210deg);
@tilt_main_50: scale(1.15) perspective(1500px) rotateY(30deg);
@side_left: 23%;
@side_bottom: -25%;

.img {
  position: absolute;
  left: 0;
  top: 0;
  width: auto;
  min-width: 70%;
  max-width: 100%;
  min-height: 65%;
  max-height: 100%;
  height: auto;
  vertical-align: middle;
  clip: rect(0 auto 50% 0);//暂时没用
  // backdrop-filter: blur(10px);
  
}
.blur {
  position: absolute;
  width: 900px;
  height: 900px;
  top: 0;
  left: 0;
}
.whole_span {
  position: relative;
  display: flex;
  width: 300%;
  height: 100%;
  left: -100%;
  background: transparent;
  top: 0;
}
.default_span {
  width: 33.2%;
  vertical-align: middle;
  z-index: 100;
  height: 100%;
  margin-right: 10px;
  backdrop-filter: blur(0px);
  // border: 1px solid white;
  background: hsla(218, 94%, 57%, 0.05);
  box-shadow: 0 2px 24px 0 hsla(220, 50%, 8%, 0.8);
  
}
.side_span {
  transform: @tilt;
  position: absolute;
  left: @side_left;
  bottom: @side_bottom;
  opacity: 0.5;
}
.left_span {
  width: 100%;
  height: 100%;
  background: hsla(220, 97%, 47%, 0.467);
}
.main_span {
  width: 100%;
  height: 100%;
  background: hsla(200, 97%, 47%, 0.467);
}
.right_span {
  width: 100%;
  height: 100%;
  background: hsla(180, 97%, 47%, 0.467);
}
.scroll1 {
  animation: scroll1 @scroll_time linear 1 @scroll_time;
}
.scroll2 {
  animation: scroll2 @scroll_time linear 1;
}
.scroll3 {
  animation: scroll3 @scroll_time linear 1 @scroll_time/2;
}
.smallize {
  animation: smallize @scroll_time linear 1;
}
@keyframes scroll1 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(31%);
  }
}
@keyframes smallize {
  0% {
    position: absolute;
    left: 30%;
    bottom: 0%;
  }
  25% {
    position: absolute;
    left: 50%;
    bottom: 0%;
    transform: @tilt_main_50;
  }
  100% {
    position: absolute;
    transform: @tilt;
    left: @side_left;
    bottom: @side_bottom;
    opacity: 0.5;
  }
}
@keyframes scroll2 {
  0% {
    left: @side_left;
  }
  100% {
    left: 0%;
    opacity: 0;
  }
}
@keyframes scroll3 {
  0% {
    position: absolute;
    left: 10%;
    opacity: 0;
    transform: scale(0.2) perspective(1500px) rotateY(-180deg);
  }
  // 25% {
  //   position: absolute;
  //   opacity: 1;
  //   left: 49%;
  //   transform: scale(0.7) perspective(1500px) rotateY(-30deg);
  // }
  100% {
    position: absolute;
    opacity: 1;
    left: 33.2%;
    transform: scale(1) perspective(1500px) rotateY(0deg);
  }
}
</style>