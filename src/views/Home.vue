<template>
  <div ref="home_scroll_listen">
    <HomeView1 :show="show1" style="width: 100%; height: 900px"></HomeView1>
    <HomeView2 :show="show2" style="width: 100%; height: 900px"></HomeView2>
    <HomeView3 :show="show2" style="width: 100%; height: 980px"></HomeView3>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, onMounted, defineEmits } from "vue"; //reactive必须接收对象
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Problem from "@/components/Home/ProblemCharts.vue";
import HomeView1 from "./Home/HomeView1.vue";
import HomeView2 from "./Home/HomeView2.vue";
import HomeView3 from "./Home/HomeView3.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const scrollTop = ref(0);
const emit = defineEmits(["showTopbarBackground"]);
const show1 = computed(() => {
  //计算属性只能监听ref而非reactive，因为ref有包装便于script属性之间响应式交互
  return scrollTop.value < 230;
});
const show2 = computed(() => {
  return scrollTop.value > 330 && scrollTop.value < 1650;
});

const home_scroll_listen = ref();
setTimeout(() => {
  home_scroll_listen.value.addEventListener("scroll", mousedown, true);
}, 300);

const mousedown = () => {
  scrollTop.value = home_scroll_listen.value.scrollTop;
  //有时间可优化为watch
  if (scrollTop.value > 10 && scrollTop.value < 100) {
    emit("showTopbarBackground", true);
  }
  if (scrollTop.value < 10) {
    emit("showTopbarBackground", false);
  }
};

// setTimeout(() => {
//   show.value = true;
// }, 2000);
</script>

<style lang="less" scoped>
// 兼容css
</style>

