<template>
  <div ref="home1" class="home1">
    <div>
      <br /><br />
      <!-- <h1 class="cyberpunk">首页DEMO/待排版</h1> -->
      <p class="introduce" :class="{show_ani:props.show,hide_ani:!props.show}">
        长江三角洲区域自然资源丰富、经济发展活跃，是人地活动最频繁的地区之一，在沉积学意义上，地处东部沿海，受季风气候与海面升降影响，是全球变化敏感区；在自然地理学意义上，地处长江下游平原地区，地势低洼，易洪易涝，是洪涝灾害易发区；在区域经济发展意义上，地处江海交汇，上海为龙头，长江黄金水道为纽带，是长江经济带发展引擎区；在行政区划上，地处世界经济最活跃区域，城市群、都市圈体系完备，区域内、区际间差异显著，是新型城镇化先行区。
      </p>
      <MapCharts class="map"></MapCharts>
      <!-- <p class="cyberpunk inverse dotted introduce" v-if="show">
        长江三角洲区域自然资源丰富、经济发展活跃，是人地活动最频繁的地区之一，在沉积学意义上，地处东部沿海，受季风气候与海面升降影响，是全球变化敏感区；在自然地理学意义上，地处长江下游平原地区，地势低洼，易洪易涝，是洪涝灾害易发区；在区域经济发展意义上，地处江海交汇，上海为龙头，长江黄金水道为纽带，是长江经济带发展引擎区；在行政区划上，地处世界经济最活跃区域，城市群、都市圈体系完备，区域内、区际间差异显著，是新型城镇化先行区。
      </p> -->
      <!-- <Fire style="position: fixed; top: 0px; left: 0; z-index: -1"></Fire> -->
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, onMounted ,defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MapCharts from "components/Home/MapCharts.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props=defineProps({
  show:{
    type:Boolean,
    default:true,
    required:false,
    
  },
})
console.log(props.show)
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
@introduce-background:hsla(210, 80%, 50%, 0.55);
.home1 {
  position: relative;
  width: 100%;
  height: 100%;
  // animation: gradients 6s linear infinite alternate;
  background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.xhby.net%2Findex%2F202110%2FW020211014807713025533.jpg&refer=http%3A%2F%2Fwww.xhby.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652678337&t=4c3cde4b783a0c66337eb84b2eab7421");
  padding-left: 0px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.home1:before {
  position: absolute;
  width: 100%;
  height: 100%;
}
.map{
  position: absolute;
  right: 50px;
  top: 100px;
  height: 800px;
  width: 800px;
  z-index: 5;
}
.introduce {
  margin-top: 13%;
  left: 60px;
  font-size: 29px !important;
  
  opacity: 0;
  width: 45%;
  backdrop-filter: blur(10px);
  color: white;
  padding: 20px;
  background: @introduce-background;
}
.show_ani{
animation: show1 1s linear forwards 0.1s;
}
.hide_ani{
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
    transform: translateX(60px) scale(1) perspective(1200px) rotateY(30deg);
    opacity: 1;
    // -webkit-transform: scale3d(1, 1, 1);
    // transform: skew(0deg);
  }
}
@keyframes hide1 {
  0% {
    transform: translateX(60px) scale(1) perspective(1200px) rotateY(30deg);
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(500px) scale(0.1) perspective(1200px) rotateY(0deg);
  }
}
</style>

