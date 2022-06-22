<template>
  <div>
    <div class="whole_span">
      <div
        class="default_span"
        style="opacity: 0; font-size: 24px"
        :class="{ scroll3: isScroll }"
      >
        <!-- {{ left_data.name }} -->
        <img :src="left_data.pic" class="img intro" />
        <!-- <div class="left_span"></div> -->
      </div>
      <div class="default_span main_span" :class="{ smallize: isScroll }">
        <!-- {{ main_data.name }} -->
        <img :src="main_data.pic" class="img img1 intro" />
        <!-- <div class="main_span"></div> -->
      </div>
      <div class="default_span side_span1" :class="{ scroll2: isScroll }">
        <!-- {{ right_data.name }} -->
        <img :src="right_data.pic" class="img img2 intro" />
      </div>
      <div class="default_span side_span2" :class="{ scroll21: isScroll }">
        <!-- {{ right_data.name }} -->
        <img :src="right_data1.pic" class="img img3 intro" />
      </div>
      <div class="word" :class="{ scroll_word: isScroll }">
        <h4>{{ tittle }}</h4>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ des }}</p>
        <el-button
        @click="toThemetic()"
          type="primary"
          style="right: 6%; position: absolute; top: 5%"
          >转到&nbsp;<el-icon><DArrowRight /></el-icon
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineExpose, } from "vue";
import { useRouter } from "vue-router";

const router=useRouter()

const toThemetic=()=>{
  localStorage.setItem("show_themetic",tittle.value)
  router.push("/themetic")
}

const props = defineProps({
  new_data: ref(Object),
});
const tittle = ref("流域生态环境演变");
const des = ref(
  "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"
);
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
const right_data1 = ref({
  name: "3333",
  pic: require("assets/problem/城市扩张.png"),
});
const isScroll = ref(false);
const scrollingSpan = () => {
  isScroll.value = true;
  left_data.value.pic = props.new_data.pic;

  let animation_time = 800;
  setTimeout(() => {
    temp_data.value.pic = right_data.value.pic; //不加.pic则变成object指针变动，而非值的变动
    right_data.value.pic = main_data.value.pic;
    right_data1.value.pic = temp_data.value.pic;
    main_data.value.pic = left_data.value.pic;

    isScroll.value = false;
  }, animation_time * 2 + 10);
  setTimeout(() => {
    des.value = props.new_data.des;
    tittle.value = props.new_data.name;
    // left_data.value = props.new_data;
  }, animation_time + 10);
};
defineExpose({ scrollingSpan });
//变换逻辑：接受新值，覆盖left，动画完成后，main→right left→main
</script>

<style lang="less" scoped>
.word {
  width: 30%;
  position: absolute;
  left: calc(37% + 50px);
  background-color: rgb(255, 255, 255);
  z-index: 5;
  color: rgb(0, 0, 0);
  top: calc(70% + 15px);
  box-shadow: 0 2px 24px 0 hsla(0, 0%, 25%, 0.8);
  transition: box-shadow 1s;
  h4 {
    text-align: left;
    padding-left: 20px;
    margin: 15px;
    margin-bottom: -2%;
    font-size: 1.25vw;
  }
  p {
    text-align: left;
    padding: 0px;
    padding-left: 35px;
    padding-right: 25px;
    line-height: 160%;
    font-size: 1.15vw;
  }
  &:hover {
    box-shadow: 0 2px 24px 0 hsla(220, 100%, 58%, 1);
  }
}

@scroll_time: 0.8s;
@tilt: scale(0.6) perspective(1500px) rotateY(160deg);
@tilt_main_50: scale(0.9) perspective(1500px) rotateY(80deg);
@side1-left: 50%;
@side1-top: -5%;
@tilt2: scale(0.5) perspective(1500px) rotateY(200deg);
@side2-left: 25%;
@side2-top: -5%;
// @randomNum: `Math.ceil(Math.random() * 80) -40`;
@randomNum: 0;
.intro-ani {
  @keyframes identifier {
    0% {
    }
    100% {
    }
  }
}
.intro {
  box-shadow: 0 2px 24px 0 hsla(0, 0%, 85%, 0.8);
  transition: box-shadow 1s;
  &:hover {
    box-shadow: 0 2px 24px 0 hsla(220, 100%, 58%, 1);
  }
}
.randMove() {
  animation: floating calc((abs(@randomNum / 4) + 15) * 1s) ease-in-out infinite
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
.img {
  position: relative;
  left: 0;
  top: 0;
  width: auto;
  min-width: 98%;
  max-width: 100%;
  min-height: 70%;
  max-height: 72%;
  height: auto;
  vertical-align: middle;
  filter: saturate(70%);
  clip: rect(0 auto 50% 0);
}
.img1 {
  .randMove();
}
.img2 {
  .randMove();
}
.img3 {
  .randMove();
}
.larger-font {
  font-size: 24px;
  transition: font-size 1s;
  &:hover {
    p {
      font-size: 28px;
    }
  }
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
  background: hsla(218, 94%, 57%, 0);
}
.side_span1 {
  position: absolute;
  transform: @tilt;
  left: @side1-left;
  top: @side1-top;
  opacity: 0.6;
  margin-left: 0;
  z-index: 2;
  font-size: 24px;
  transition: all 1s;
  &:hover {
    z-index: 1;
    font-size: 28px;
    transform: scale(0.7) perspective(1500px) rotateY(180deg);
  }
}

.side_span2 {
  position: absolute;
  transform: @tilt2;
  left: @side2-left;
  top: @side2-top;
  opacity: 0.5;
  margin-left: 0;
  z-index: 1;
  font-size: 24px;
  transition: all 1s;
  &:hover {
    z-index: 1;
    font-size: 28px;
    transform: scale(0.6) perspective(1500px) rotateY(180deg);
  }
}

.main_span {
  margin-left: 100px;
  z-index: 3;
  margin-top: -2%;
  font-size: 24px;
  line-height: 150%;
  transition: all 1s;
  &:hover {
    transform: scale(1.02);
  }
}

.scroll1 {
  animation: scroll1 @scroll_time linear 1 @scroll_time;
}
.scroll2 {
  animation: scroll2 @scroll_time linear forwards;
}
.scroll21 {
  animation: scroll21 @scroll_time / 2 linear forwards @scroll_time;
  @keyframes scroll21 {
    0% {
    }
    100% {
      left: 0%;
      top: 5%;
      opacity: 0;
      transform: scale(1.2) perspective(1500px) rotateY(240deg);
    }
  }
}
.scroll_word {
  animation: scroll_w @scroll_time*2 linear forwards;
  @keyframes scroll_w {
    0% {
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1) translateX(-1000px) perspective(1000px)
        rotateY(100deg);
    }
    55% {
      opacity: 0.5;
      transform: scale(1) translateX(-1000px) perspective(1000px)
        rotateY(-100deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) perspective(1000px) rotateY(0deg);
    }
  }
}
.scroll3 {
  animation: scroll3 @scroll_time linear 1 @scroll_time;
}
.smallize {
  animation: smallize @scroll_time linear forwards;
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
    top: 0%;
  }
  50% {
    position: absolute;
    left: 58%;
    top: 0%;
    transform: @tilt_main_50;
  }
  100% {
    position: absolute;
    transform: @tilt;
    left: @side1-left;
    top: @side1-top;
    margin-left: 0;
    opacity: 0.6;
    margin-top: 0%;
  }
  // 100% {
  //   opacity: 0;
  // }
}
@keyframes scroll2 {
  0% {
  }
  100% {
    left: @side2-left;
    top: @side2-top;
    opacity: 0.5;
    transform: @tilt2;
  }
}
@keyframes scroll3 {
  0% {
    position: absolute;
    left: 0%;
    top: -30%;
    opacity: 0.5;
    transform: scale(1.8) perspective(1500px) rotateY(-120deg);
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
    top: 0%;
    margin-top: -2%;
    left: calc(33.2% + 100px);
    transform: scale(1) perspective(1500px) rotateY(0deg);
  }
}
</style>