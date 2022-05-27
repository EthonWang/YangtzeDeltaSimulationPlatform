<template>
  <div style="width: 100%; height: 100%">
    <div class="tabs-page">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="概览" name=""> </el-tab-pane>
        <el-tab-pane label="数据中心" name="data"> </el-tab-pane>
        <el-tab-pane label="模型中心" name="model"></el-tab-pane>
        <el-tab-pane label="任务中心" name="task"></el-tab-pane>
        <router-view class="data-center"></router-view>
        <!-- <el-tab-pane label="其他" name="fourth">Task</el-tab-pane> -->
      </el-tabs>
      <ScienceProblemData
        class="science"
      ></ScienceProblemData>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import DataCenter from "./UserFunctionCollection/DataCenter.vue";
import ScienceProblemData from "./UserFunctionCollection/ScienceProblemData.vue";

const route = useRoute();

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const activeName = ref("");
const handleClick = (tab, event) => {
  // console.log(tab,event)
  toRouter(tab.props.name);
  if (tab.props.name == "") {
    document.getElementsByClassName("user-info")[0].style.opacity = 1;
    document.getElementsByClassName("user-info")[0].style.left = "16.5vw";
    document.getElementsByClassName("el-tabs__nav")[0].style.marginLeft="5vw"
    document.getElementsByClassName("science")[0].style.opacity = 0;
    document.getElementsByClassName("function")[0].style.width="51.2vw"
    document.getElementsByClassName("function")[0].style.right="15vw"

  } else {
    document.getElementsByClassName("user-info")[0].style.opacity = 0;
    document.getElementsByClassName("user-info")[0].style.left = "6vw";
    document.getElementsByClassName("el-tabs__nav")[0].style.marginLeft="17vw"
    document.getElementsByClassName("science")[0].style.opacity = 1;
    document.getElementsByClassName("function")[0].style.width="72vw"
    document.getElementsByClassName("function")[0].style.right="5vw"

  }
};
// const showScience = () => {
//   science_show.value = !science_show.value;
//   document.getElementsByClassName("user-info")[0].style.opacity =
//     science_show.value == true ? "0" : "1";
// };
// setTimeout(showScience, 1000);
const toRouter = (route) => {
  router.push("/user/" + route);
};
</script>

<style lang="less" scoped>
// 兼容css
.tabs-page {
  position: absolute;
  width: 100%;
  height: 87%;
  top: 0;

  /deep/ .el-tabs__nav {
    margin-left: 5vw;
    transition: all 1s;

    .el-tabs__item {
      font-size: 0.9vw;
      margin-right: 4vw;
    }
  }

  /deep/ .el-tabs__content {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    // background-color: aqua;
  }
}

.demo-tabs {
  width: 100%;
  height: 100%;
}

.data-center {
  width: 90%;
  height: 100%;
  overflow-y:scroll ;
}
.science {
  position: fixed;
  top: 14%;
  z-index: 500;
  // padding-top: 1vh;
  left: 5vw;
  width: 290px;
  height: 80%;
  border: 0.5px solid rgba(197, 197, 197, 0.219);
  box-shadow: 0 1px 3px rgba(22, 22, 22, 0.1);
  transition: all 1s;
  opacity: 0;
}
</style>