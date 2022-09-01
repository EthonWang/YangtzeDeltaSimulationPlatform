<template>
  <div ref="home_scroll_listen" style="overflow-x: hidden !important">
    <div class="block_home"></div>
    <HomeView3
      :show="show2"
      style="width: 100%; height: 100vh"
      @explore="explore()"
    ></HomeView3>
    <HomeView1
      :show="show1"
      style="width: 100%; height: 96.04vh"
      @to-sci="toSci()"
    ></HomeView1>
    <HomeView2 :show="show2" style="width: 100%; height: 99.96vh"></HomeView2>
    <HomeViewFooter style="width: 100%; height: 35vh"></HomeViewFooter>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { computed, ref, defineEmits } from "vue"; //reactive必须接收对象
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import HomeView1 from "./Home/HomeView1.vue";
import HomeView2 from "./Home/HomeView2.vue";
import HomeView3 from "./Home/HomeView3.vue";
import HomeViewFooter from "./Home/HomeViewFooter.vue";
import { Encrypt, Decrypt } from "@/util/codeUtil";

localStorage.setItem("fromHome", Encrypt("true"));

const scrollTop = ref(0);
const emit = defineEmits(["showTopbarBackground"]);

const standardizeHeight = (top) => {
  let clientH = window.innerHeight;
  return (top * clientH) / 937;
};
const show1 = computed(() => {
  //计算属性只能监听ref而非reactive，因为ref有包装便于script属性之间响应式交互
  return scrollTop.value < standardizeHeight(260 + x);
});
const x = window.innerHeight;
const show2 = computed(() => {
  return (
    scrollTop.value > standardizeHeight(430 + x) &&
    scrollTop.value < standardizeHeight(1360 + x)
  );
});

const home_scroll_listen = ref();
setTimeout(() => {
  home_scroll_listen.value.addEventListener("scroll", mousedown, true);
}, 300);

const mousedown = () => {
  scrollTop.value = home_scroll_listen.value.scrollTop;
  if (
    scrollTop.value > standardizeHeight(10) &&
    scrollTop.value < standardizeHeight(1000)
  ) {
    emit("showTopbarBackground", true);
  }
  if (scrollTop.value < standardizeHeight(10)) {
    emit("showTopbarBackground", false);
  }
  if (
    scrollTop.value > 0.9 * window.innerHeight &&
    scrollTop.value < 1.1 * window.innerHeight
  ) {
    explore();
    document.getElementsByClassName("block_home")[0].style.opacity = 1;
    setTimeout(() => {
      document.getElementsByClassName("block_home")[0].style.opacity = 0;
    }, 500);
  } else if (
    scrollTop.value > 1.86 * window.innerHeight &&
    scrollTop.value < 2 * window.innerHeight
  ) {
    home_scroll_listen.value.scrollTop = window.innerHeight * 1.96;
    document.getElementsByClassName("block_home")[0].style.opacity = 1;
    setTimeout(() => {
      document.getElementsByClassName("block_home")[0].style.opacity = 0;
    }, 500);
  } else if (
    document.getElementsByClassName("container")[0].style.width == "900px"
  ) {
    document.getElementsByClassName("container")[0].style.width = "100vw";
    setTimeout(() => {
      document.getElementsByClassName("bg")[0].style.opacity = "1";
      document.getElementsByClassName("user-topbar")[0].style.opacity = "1";
    }, 500);
  }
};

const toSci = () => {
  home_scroll_listen.value.scrollTop = window.innerHeight * 1.96;
};

const suitable = () => {
  let compare = window.innerWidth / 1920;
  document.getElementsByClassName("earth")[0].style.transform =
    "scale(" + compare + ")";
  document.getElementsByClassName("sunburst")[0].style.transform =
    "perspective(1500px) rotateY(0deg) scale(" + compare + ")";
};
window.onresize = suitable;
setTimeout(() => {
  if (window.innerWidth == 1920) {
    return;
  }
  suitable();
}, 100);
const explore = () => {
  home_scroll_listen.value.scrollTop = window.innerHeight;
  document.getElementsByClassName("container")[0].style.width = "900px";
  setTimeout(() => {
    document.getElementsByClassName("bg")[0].style.opacity = "0";
    document.getElementsByClassName("user-topbar")[0].style.opacity = "0";
  }, 500);
};
</script>

<style lang="less" scoped>
// 兼容css
.block_home {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 600;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  pointer-events: none;
  border: 5px solid hsl(10, 100%, 44%);
  opacity: 0;
  transition: all 0.5s;
}
</style>

