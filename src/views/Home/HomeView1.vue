<template>
  <div ref="home1" class="home1">
    <div class="container">
      <div
        class="desContainer"
        :class="{ show_ani: props.show, hide_ani: !props.show }"
      >
        <h1>长三角综合模拟器</h1>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长三角模拟器汇聚了大量长江三角洲区域的地理模型和数据资源，用以揭示区域水循环及其内部驱动机理的水循环，阐明全球气候变化条件下区域环境演化规律，以及长三角城市化与人地关系相互作用的互动互馈机制的综合集成模型，实现区域灾害的快速响应与治理，服务于长三角高质量一体化发展国家战略。
        </p>
        <div class="login">
          <el-input
            v-model="input"
            type="password"
            placeholder="邮件地址"
            show-password
          />
          <el-button type="success">登录</el-button>
        </div>
      </div>
      <div class="merge-earth"></div>
      <MapCharts
        class="earth"
        :class="{ show_ani: props.show, hide_ani: !props.show }"
      ></MapCharts>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1680 40"
        class="position-absolute width-full z-1"
        style="bottom: -1px"
      >
        <path d="M0 40h1680V30S1340 0 840 0 0 30 0 30z" fill="#fff"></path>
      </svg>
    </div>
    <!-- <div>
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
      /> -->
    <!-- <MapCharts class="map"></MapCharts> -->
    <!-- <p class="cyberpunk inverse dotted introduce" v-if="show">
        长江三角洲区域自然资源丰富、经济发展活跃，是人地活动最频繁的地区之一，在沉积学意义上，地处东部沿海，受季风气候与海面升降影响，是全球变化敏感区；在自然地理学意义上，地处长江下游平原地区，地势低洼，易洪易涝，是洪涝灾害易发区；在区域经济发展意义上，地处江海交汇，上海为龙头，长江黄金水道为纽带，是长江经济带发展引擎区；在行政区划上，地处世界经济最活跃区域，城市群、都市圈体系完备，区域内、区际间差异显著，是新型城镇化先行区。
      </p> -->
    <!-- <Fire style="position: fixed; top: 0px; left: 0; z-index: -1"></Fire> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import MapCharts from "components/Home/MapCharts.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  show: Boolean,
});
const toModel = () => {
  router.push("/model");
};

const home1 = ref();

// setTimeout(() => {
//   show.value = true;
// }, 2000);
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  height: 100%;
  width: 100%;
  background: url("../../assets/starfield.jpg");
  background-size: 100% 100%;
  .position-absolute {
    position: absolute !important;
  }
  .width-full {
    width: 100% !important;
  }
  .z-1 {
    z-index: 1 !important;
  }
  svg:not(:root) {
    overflow: hidden;
  }
}
.container .desContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 13%;
  top: 18%;
  width: 35.55vw;
  height: 42.64vh;
  transition: all 1s;
  padding: 20px 20px;
  h1 {
    color: white;
    font-size: 3.75vw;
    margin-top: -10px;
    margin-bottom: 10px;
  }
  p {
    // margin-top: -10px;
    font-size: 1.458vw;
    color: white;
    line-height: 170%;
  }
  /deep/ .login {
    display: flex;
    align-items: center;
    .el-button--success {
      font-size: 0.94vw;
      width: 6.25vw;
      height: 4.26vh;
    }
    .el-input__inner {
      font-size: 0.94vw;
      width: 23.95vw !important;
      height: 4.26vh;
    }
  }
  // &:hover {
  //   transform:  translateX(50px) scale(1.05);
  // }
}
.container .merge-earth {
  position: absolute;
  right: 12%;
  top: 8%;
  // bottom: 50px;
  width: 39.06vw;
  height: $width;
  z-index: 1;
}
@value:100vw / 100px;
.container .earth {
  position: absolute;
  right: 12%;
  top: 5%;
  // bottom: 50px;
  // width: 39.06vw;
  width: 800px;
  height: $width;
  z-index: 0;
  // background-color: red;
  transition: all 1s;
  transform-origin: 100% 0;
  // transform: scale(e(replace("@{value}", vw, '')));
  // &:hover {
  // transform: translate(-50px,50px) scale(1.35);
  // }
}
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
  // https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.jiemian.com%2F101%2Foriginal%2F20200925%2F160101930086874400.jpg&refer=http%3A%2F%2Fimg1.jiemian.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653721526&t=987f7aabf97094519e7403f41e361028
  // background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.xhby.net%2Findex%2F202110%2FW020211014807713025533.jpg&refer=http%3A%2F%2Fwww.xhby.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653806992&t=cfa997108f4a23626f2251cf239cc2cd");
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
  transform: perspective(1500px) rotateY(0deg);
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
  color: hsla(210, 80%, 100%, 1);
  padding: 20px;
  background-color: hsla(210, 80%, 50%, 0.65);
  transition: all 1s;
  transform: scale(1) perspective(1500px) rotateY(0deg);
}
.introduce:hover {
  backdrop-filter: blur(10px);
  background-color: hsla(210, 80%, 50%, 0.65);
  color: hsla(210, 80%, 95%, 1);
  transform: translateX(200px) scale(1.15) perspective(1200px) rotateY(2deg);
}
.show_ani {
  animation: show1 0.8s linear 1;
}
.hide_ani {
  animation: hide1 0.8s linear forwards;
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
    transform: scale(0.9);
    // transform: skew(30deg);
  }
  100% {
    // -webkit-transform: scale3d(1, 1, 1);
    // transform: skew(0deg);
  }
}
@keyframes hide1 {
  0% {
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}
</style>

