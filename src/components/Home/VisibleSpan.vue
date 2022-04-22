<template>
  <div>
    <div class="whole_span" :class="{ scrolling: isScroll }">
      <div class="default_span">
        {{ left_data.name }}
        <img :src="left_data.pic" class="img" />
        <!-- <div class="left_span"></div> -->
      </div>
      <div class="default_span" :class="{ smallize: isScroll }">
        {{ main_data.name }}
        <img :src="main_data.pic" class="img" />
        <!-- <div class="main_span"></div> -->
      </div>
      <div class="default_span side_span">
        {{ right_data.name }}
        <img :src="right_data.pic" class="img" />
        <!-- <div class="right_span"></div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineExpose } from "vue";

const props = defineProps({
  data: ref(Object),
});

let new_data = ref({
  name: "4444",
  pic: "https://img2.baidu.com/it/u=4014285563,2591904440&fm=253&fmt=auto&app=138&f=PNG?w=500&h=208",
});
let main_data = ref({
  name: "1111",
  pic: "https://img2.baidu.com/it/u=3033267735,1729056335&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
});
let left_data = ref({
  name: "2222",
  pic: "https://img0.baidu.com/it/u=1663500791,839323706&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
});
let right_data = ref({
  name: "3333",
  pic: "https://img2.baidu.com/it/u=3271466876,3945229185&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
});
const isScroll = ref(false);
const scrollingSpan = () => {
  isScroll.value = true;
  setTimeout(() => {
    isScroll.value = false;
    new_data.value = right_data.value;
    right_data.value = main_data.value;
    main_data.value = left_data.value;
    left_data.value = new_data.value;
  }, 500);
};
defineExpose({ scrollingSpan });
//变换逻辑：接受新值，覆盖left，动画完成后，main→right left→main
</script>

<style lang="less" scoped>
@side_scale: 0.85;
@scroll_time: 0.5s;
.img {
  width: 100%;
  height: 97%;
}
.whole_span {
  position: relative;
  display: flex;
  width: 300%;
  height: 100%;
  left: -89.5%;
  top: 10%;
}
.default_span {
  width: 30%;
  height: 100%;
  margin-right: 10px;
  backdrop-filter: blur(10px);

  background: hsla(220, 97%, 47%, 0.467);
}
.side_span {
  transform: scale(@side_scale);
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
.scrolling {
  animation: scroll1 @scroll_time linear 1;
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
  100% {
    transform: scale(@side_scale);
  }
}
@keyframes scroll2 {
  0% {
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>