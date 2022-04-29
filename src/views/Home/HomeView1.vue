<template>
  <div ref="home1" class="home1">
    <div>
      <br /><br />
      <!-- <h1 class="cyberpunk">首页DEMO/待排版</h1> -->
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
      />
      <!-- <MapCharts class="map"></MapCharts> -->
      <!-- <p class="cyberpunk inverse dotted introduce" v-if="show">
        长江三角洲区域自然资源丰富、经济发展活跃，是人地活动最频繁的地区之一，在沉积学意义上，地处东部沿海，受季风气候与海面升降影响，是全球变化敏感区；在自然地理学意义上，地处长江下游平原地区，地势低洼，易洪易涝，是洪涝灾害易发区；在区域经济发展意义上，地处江海交汇，上海为龙头，长江黄金水道为纽带，是长江经济带发展引擎区；在行政区划上，地处世界经济最活跃区域，城市群、都市圈体系完备，区域内、区际间差异显著，是新型城镇化先行区。
      </p> -->
      <!-- <Fire style="position: fixed; top: 0px; left: 0; z-index: -1"></Fire> -->
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// import MapCharts from "components/Home/MapCharts.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
    required: false,
  },
});
const toModel = () => {
  router.push("/model");
};
console.log(props.show);
const home1 = ref();

// setTimeout(() => {
//   show.value = true;
// }, 2000);
</script>

<style lang="less" scoped>
// 兼容css
@right-color: hsla(351, 73%, 22%, 0);
@base-color: hsl(238, 100%, 95%);
@left-color: hsla(190, 90%, 20%, 0);
@introduce-background: hsla(210, 80%, 50%, 0.55);
.home1 {
  position: relative;
  width: 100%;
  height: 100%;
  // animation: gradients 6s linear infinite alternate;
  background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.jiemian.com%2F101%2Foriginal%2F20200925%2F160101930086874400.jpg&refer=http%3A%2F%2Fimg1.jiemian.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653721526&t=987f7aabf97094519e7403f41e361028");
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
  transform: perspective(1500px) rotateY(-15deg);
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
  color: hsla(210, 80%, 50%, 1);
  padding: 20px;
  background-color: hsla(210, 80%, 50%, 0.05);
  transition: all 1s;
  transform:  scale(1) perspective(1500px) rotateY(15deg);
}
.introduce:hover {
    backdrop-filter: blur(10px);
    background-color: hsla(210, 80%, 50%, 0.65);
  color: hsla(210, 80%, 95%, 1);
  transform: translateX(260px) scale(1.2) perspective(1200px) rotateY(2deg);
}
.show_ani {
  animation: show1 1s linear 1;
}
.hide_ani {
  animation: hide1 1s linear forwards 0.1s;
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
    transform: translateX(-500px) scale(0.1) perspective(1200px) rotateY(0deg);
    // transform: skew(30deg);
  }
  100% {
    

    // -webkit-transform: scale3d(1, 1, 1);
    // transform: skew(0deg);
  }
}
@keyframes hide1 {
  0% {
    transform: translateX(60px) scale(1) perspective(1200px) rotateY(30deg);

  }

  100% {
    opacity: 0;
    transform: translateX(500px) scale(0.1) perspective(1200px) rotateY(0deg);
  }
}
</style>

