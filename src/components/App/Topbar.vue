<template>
  <div class="container">
    <span
      class="bg"
      style="position: absolute; z-index: 2; transition: all 0.5s"
      :class="{
        background_show: background_show,
        background_hide: !background_show,
      }"
    ></span>

    <img
      class="bg_pro"
      src="@/assets/img/mesh-673.png"
      style="
        position: absolute;
        z-index: 2;
        width: 100vw;
        height: 65px;
        transition: all 0.5s;
        opacity: 0;
      "
    />
    <div class="head">
      <!-- <span class="logo">长 三 角 模 拟 器</span> -->
      <img
        src="../../assets/globle.svg"
        id="logo"
        style="
          transition: all 1s;
          height: 70%;
          margin-left: 1.5vw;
          margin-top: 0px;
          color: white;
          position: relative;
          z-index: 5;
        "
      />
      <div class="main-menucontainer topbar">
        <div
          v-for="(bar, index) in barList"
          :key="bar"
          @click="sendRouterToFather(bar.path, index)"
          style="font-size: 25px; cursor: pointer"
          class="set_7_btn-wrapper"
        >
          <svg height="54" width="150">
            <rect id="set_7_button1" height="50" width="150"></rect>
          </svg>
          <div id="set_7_text" :class="{ pickup: pick[index] }">
            <span>{{ bar.name }}</span>
          </div>
        </div>
      </div>
      <!-- <avatar class="user-topbar" ref="user" /> -->
      <img
        class="user-topbar"
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.ntimg.cn%2F20140727%2F6608733_095451721000_2.jpg&refer=http%3A%2F%2Fpic.ntimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662540904&t=bf172540a1b26f7eb55b539080c3b0a1"
        alt=""
        v-if="userAvatar == null"
        @click="sendRouterToFather('/user', 3)"
      />
      <img
        @click="sendRouterToFather('/user', 3)"
        class="user-topbar"
        :src="devServer + userAvatar"
        alt=""
        v-else
      />
    </div>
  </div>
</template>

<script setup>
import { userInfo } from "os";
import { reactive, computed, ref, defineEmits, defineProps, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import graphAPI from "@/api/user/graph";
import { userAvatar } from "@/assets/user/scienceChoose";
import { useStore } from "vuex";
import { Encrypt, Decrypt } from "@/util/codeUtil";

const graphapi = new graphAPI();
const store = useStore();
const devServer = ref(store.getters.devIpAddress_backup);
let user_info = localStorage.getItem("userInfo");
if (user_info != null && user_info != undefined) {
  user_info=JSON.parse(Decrypt(user_info))
  userAvatar.value = user_info.avatar;
  graphapi.initGraph(user_info.id).then((res) => {
    console.log(res);
  });
}



const props = defineProps({
  background_show: ref(Boolean),
});
const router = useRouter();
const route = useRoute();
const barList = reactive(
  router.options.routes.filter((item) => item.isBar == true)
);
const relation = require("@/assets/data/another/relation.json");
localStorage.setItem("relation", Encrypt(JSON.stringify(relation)));
const user = ref();
const notHome = ref(true);
const getRootPath = (whole) => {
  return whole.split("/")[1];
};
const searchIndexInRoutes = () => {
  let i = 0;
  if (getRootPath(route.path) != "") {
    // setTimeout(() => {
    //   document.getElementsByClassName("user-topbar")[0].style.right = "2vw";
    //   document.getElementById("logo").style.marginLeft = "2vw";
    //   document.getElementsByClassName("topbar")[0].style.left = "5vw";
    // }, 150);

    pick.value = new Array(barList.length).fill(0);
  } else {
    // document.getElementsByClassName("user-topbar")[0].style.right = "20vw";
  }
  if (getRootPath(route.path) != "") {
    return;
  }
  for (; i < barList.length; i++) {
    if (getRootPath(barList[i].path) == getRootPath(route.path)) {
      pick.value[i] = 1;
      return;
    }
  }
};
watch(
  () => route.path,
  (newValue, oldValue) => {
    if (getRootPath(newValue) != "") {
      setTimeout(() => {
        document.getElementsByClassName("bg")[0].style.opacity = "0";
        document.getElementsByClassName("bg_pro")[0].style.opacity = "0";
        document.getElementsByClassName("container")[0].style.background =
          "#24292f3b";
      }, 100);
      setTimeout(() => {
        pick.value = new Array(barList.length).fill(0);
        // document.getElementsByClassName("user-topbar")[0].style.right = "2vw";
        // document.getElementById("logo").style.marginLeft = "2vw";
        // document.getElementsByClassName("topbar")[0].style.left = "5vw";
        for (let i in barList) {
          if (getRootPath(barList[i].path) == getRootPath(newValue)) {
            pickup(i);
          }
        }
      }, 201);
      let fromHome = Decrypt(localStorage.getItem("fromHome"));
      if (fromHome == "true") {
        setTimeout(() => {
          localStorage.setItem("fromHome", Encrypt("false"));
          location.reload();
        }, 700);
      }
    }
  }
);
const emit = defineEmits(["RouterFromBar"]);
const sendRouterToFather = (route1, index) => {
  if (getRootPath(route1) != "") {
    if (
      user_info == null &&
      getRootPath(route1) != "case" &&
      getRootPath(route1) != "themetic"
    ) {
      router.push("/login");
      return;
    }
    router.push(route1);
    // if (index != -1) {
    //     pickup(index);
    //   }
  }
  // setTimeout(() => {
  //   document.getElementsByClassName("user-topbar")[0].style.right = "20vw";
  //   document.getElementById("logo").style.marginLeft = "17vw";
  //   document.getElementsByClassName("topbar")[0].style.left =
  //     "calc(17% + 50px)";
  // }, 1000);

  pickup(index);
  emit("RouterFromBar", route1);
};
let pick = ref(new Array(barList.length).fill(0));

const pickup = (row) => {
  pick.value = new Array(barList.length).fill(0);
  pick.value[row] = 1;
};
setTimeout(searchIndexInRoutes, 100);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../css/btn/btn7.css";

.user-topbar {
  // display: none;
  position: absolute;
  transition: all 1s;
  color: aliceblue;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-top: 0px;
  right: 1vw;
  // margin-top: 1vh;
  cursor: pointer;
  transition: all 1s;
  &:hover{
    filter: brightness(1.75);
  }
}

.topbar {
  // margin-left: 20px;
  width: 100%;
  position: absolute;
  // left: calc(17% + 50px);
  left: 4vw;
  transition: all 1s;
}

.pickup {
  border: hsl(201, 100%, 65%) 2px solid;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  text-align: center;
  transform: scale(1.05);
  // animation-name: glitched;
  // transition: transform 1s;
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
  // padding-top: 0vh;
  background-color: #24292f3b;
  backdrop-filter: blur(10px);
  transition: all 1s;
}

.background_show {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  // backdrop-filter: blur(10px);
  animation: background_show 0.8s linear forwards;

  @keyframes background_show {
    0% {
      width: 0vw;
      background-color: hsla(200, 100%, 100%, 1);
    }

    100% {
      width: 100.4vw;
      z-index: 2;
      background-color: #24292fce;
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
  animation: background_hide 0.8s linear forwards;

  @keyframes background_hide {
    0% {
      width: 100.4vw;
      background-color: #24292fce;
      transform: translateX(0px);
      opacity: 1;
    }

    99% {
      width: 0vw;
      background-color: hsla(200, 0%, 52%, 0.3);
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
  position: relative;
  z-index: 10;
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
  margin-right: 0.625vw;
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
</style>
