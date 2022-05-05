<template>
  <div class="container">
    <span
      style="position: absolute"
      :class="{
        background_show: background_show,
        background_hide: !background_show,
      }"
    ></span>
    <div class="head">
      <!-- <span class="logo">长 三 角 模 拟 器</span> -->
      <img
        src="../../assets/globle.svg"
        style="height: 40px; margin-left: 17%; margin-top: 0px; color: white"
      />
      <div class="main-menucontainer topbar">
        <div
          v-for="(bar, index) in barList"
          :key="bar"
          @click="sendRouterToFather(bar.path, index)"
          style="font-size: 16px; cursor: pointer"
          class="set_7_btn-wrapper"
        >
          <svg height="54" width="120">
            <rect id="set_7_button1" height="54" width="120"></rect>
          </svg>
          <div id="set_7_text" :class="{ pickup: pick[index] }">
            <span>{{ bar.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, defineEmits, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  background_show: ref(Boolean),
});
const router = useRouter();
const route = useRoute();
const barList = reactive(
  router.options.routes.filter((item) => item.isBar == true)
);
const searchIndexInRoutes = () => {
  let i = 0;
  for (; i < barList.length; i++) {
    if (barList[i].path == route.path) {
      pick.value[i] = 1;
      return;
    }
  }
};
const emit = defineEmits(["RouterFromBar"]);
const sendRouterToFather = (route, index) => {
  pickup(index);
  emit("RouterFromBar", route);
};
let pick = ref(new Array(barList.length).fill(0));

const pickup = (row) => {
  pick.value = new Array(barList.length).fill(0);
  pick.value[row] = 1;
};
window.onload = searchIndexInRoutes;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../css/btn/btn7.css";

.topbar {
  // margin-left: 20px;
  width: 100%;
  position: absolute;
  left: calc(17% + 50px);
}
.pickup {
  border: hsl(54, 94%, 75%) 1px solid;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  text-align: center;
  transform: scale(1.1);
  // animation-name: glitched;

  margin-left: 26%;
  width: 50%;
  animation-duration: calc(0.9s * 1.4);
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  // &:before {
  //   animation-name: beforeglitched;
  //   animation-duration: calc(0.9s * 2);
  //   animation-iteration-count: infinite;
  //   animation-timing-function: linear;

  // }
  // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;
}
.logo {
  font-size: 35px;
  font-weight: 600;
  margin-left: 30px;
  position: relative;
  z-index: 100;
}
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  background-color: hsla(200, 100%, 36%, 0);
  backdrop-filter: blur(10px);
}
.background_show {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  // backdrop-filter: blur(10px);
  animation: background_show 0.8s linear forwards;
  @keyframes background_show {
    0% {
      width: 0vw;
      background-color: hsla(200, 100%, 100%, 1);
    }
    100% {
      width: 100.1vw;
      background-color: hsla(200, 100%, 52%, 0.5);
    }
  }
}
.background_hide {
  position: absolute;
  height: 100%;
  width: 100vw;
  top: 0;
  left: 0;
  // backdrop-filter: blur(10px);
  animation: background_hide 0.8s linear 1;
  @keyframes background_hide {
    0% {
      width: 100.1vw;
      background-color: hsla(200, 100%, 52%, 0.5);
      transform: translateX(0px);
      opacity: 1;
    }
    99% {
      width: 0vw;
      background-color: hsla(200, 0%, 52%, 0.7);
      transform: translateX(100vw);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
.head {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // transition: all 2s;
}

::v-deep.head .el-menu--horizontal .el-menu-item {
  height: 70px;
  line-height: 70px;
}

.main {
  width: 100%;
  height: 100%;
}
.contact-info {
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 12px;
}
.head .main-iconbox {
  display: flex;
  align-items: center;
  margin-left: 40px;
  margin-right: 10px;
}
.head .main-iconbox .main-icon {
  width: 38px;
  height: 38px;
  margin-right: 5px;
}
.head .main-iconbox .main-iconname {
  width: 80px;
  height: 40px;
}
.head .main-menucontainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: fit-content;
}
.head .main-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;

  margin-right: 40px;
}
.head .main-user i {
  font-size: 30px;
  color: white;
  font-size: 28px;
}
.head .main-user p {
  margin-left: 10px;
  font-size: 20px;
  color: white;
}
@keyframes glitched {
  0% {
    left: -4px;
    transform: skew(-20deg) scale(1.1);
  }
  11% {
    left: 2px;
    transform: skew(0deg) scale(1.1);
  }
  50% {
    transform: skew(0deg) scale(1.1);
  }
  51% {
    transform: skew(10deg) scale(1.1);
  }
  60% {
    transform: skew(0deg) scale(1.1);
  }
  100% {
    transform: skew(0deg) scale(1.1);
  }
}
@keyframes beforeglitched {
  0% {
    left: -4px;
    transform: skew(-20deg);
    clip-path: polygon(
      0px 0px,
      85px 0px,
      90px 5px,
      100% 5px,
      100% 6px,
      85px 6px,
      80px 10px,
      0px 10px
    );
  }
  11% {
    left: 2px;
    transform: skew(0deg);
    clip-path: polygon(
      0px 0px,
      85px 0px,
      90px 5px,
      100% 5px,
      100% 6px,
      85px 6px,
      80px 10px,
      0px 10px
    );
  }
  50% {
    transform: skew(0deg);
    clip-path: polygon(
      0px 0px,
      85px 0px,
      90px 5px,
      100% 5px,
      100% 6px,
      85px 6px,
      80px 10px,
      0px 10px
    );
  }
  51% {
    transform: skew(0deg);
    clip-path: polygon(
      0px 0px,
      85px 0px,
      90px 5px,
      100% 5px,
      40% 5px,
      calc(40% - 30px) 0px,
      calc(40% + 30px) 0px,
      calc(45% - 15px) 5px,
      100% 5px,
      100% 6px,
      calc(45% - 14px) 6px,
      calc(40% + 29px) 1px,
      calc(40% - 29px) 1px,
      calc(40% + 1px) 6px,
      85px 6px,
      80px 10px,
      0px 10px
    );
  }
  60% {
    transform: skew(0deg);
    clip-path: polygon(
      0px 0px,
      85px 0px,
      90px 5px,
      100% 5px,
      100% 6px,
      85px 6px,
      80px 10px,
      0px 10px
    );
  }
  100% {
    transform: skew(0deg);
    clip-path: polygon(
      0px 0px,
      85px 0px,
      90px 5px,
      100% 5px,
      100% 6px,
      85px 6px,
      80px 10px,
      0px 10px
    );
  }
}
</style>
