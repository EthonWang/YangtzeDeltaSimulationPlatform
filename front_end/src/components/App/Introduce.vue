<!-- 设计人：张子卓 -->
<!-- 功能：介绍个人实验室的基本信息与用法 -->
<template>
  <div class="about">
    <div style="height: 100%; width: 100%;">
      <!-- <span class="demonstration"
        >Switch when indicator is hovered (default)</span
      > -->
      <el-carousel height="60vh">
        <el-carousel-item style="height: 100%;" v-for="config in configs" :key="config">
          <div class="over-item">
            <div style="margin: 2%; width: 100%"></div>
            <h3><el-icon><InfoFilled /></el-icon>&nbsp;简介：{{ config.tittle }}</h3>
            <el-divider></el-divider>
            <div class="des" v-if="config.tittle=='我的数据'">{{config.sum_des}}：{{ config.all }}</div>
            <div class="des">{{ config.des }}</div>
            <el-divider></el-divider>
            <img :src="config.img" style="width: 100%;" alt="">
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Encrypt,Decrypt } from "@/util/codeUtil"

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  picture: [],
});
const fill = ref("fill");
const allResourceNum=JSON.parse(Decrypt(localStorage.getItem("allResourceNum")))
const edit_des = ref(false);
const configs = reactive([
  {
    tittle: "我的数据",
    sum_des:"我的数据总量",
    des: "我的数据云盘，用于存储我在各个科研实验中使用的数据。会自动保存您进行实验后的结果数据。您也可分享您的数据。",
    edit_des: false,
    img:require("../../assets/img/DATA.png"),
    all: allResourceNum.privateDataNum,
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  },
  {
    tittle: "我的实验",
    sum_des:"我的实验总量",
    des: "此处是我的实验室，汇总我在各个科学专题的研究中执行的实验，用于使用数据并调用模型进行地理模拟问题的求解，并对结果进行分析与可视化。",
    img:require("../../assets/img/LAB.png"),
    edit_des: false,
    all: allResourceNum.themeNum,
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  },
]);

</script>

<style lang="less" scoped>
// 兼容css
.demonstration {
  color: var(--el-text-color-secondary);
}
.over-item {
  margin-left: 7.5%;
  position: relative;
  width: calc(90% - $margin-left);
  height: fit-content;
  line-height: 120%;
  text-align: left !important;
  float: left !important;
  overflow: scroll;
  .des {
    color: rgb(58, 58, 58);
    width: 90%;
    font-size: 20px;
    margin: 2vh 0 2vh 0;
    line-height: 150%;
  }
  h3 {
    color: #0969da;
    font-weight: 500;
    margin:2% 0 2% 0 ;
    font-size: 22px;
    display: flex;
    align-items: center;
  }
  span {
    color: rgb(105, 105, 105);
    justify-items: center;
    vertical-align: middle;
  }
}



</style>

