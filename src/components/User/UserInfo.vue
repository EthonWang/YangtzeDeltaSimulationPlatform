<template>
  <div style="" class="user-span">
    <avatar class="img" style="" />
    <div class="infoSpan">
      <h4>{{ data.name }}</h4>
      <span style="color: gray">{{ data.email }}</span
      ><br />
      <span>{{ data.description }} </span><br />
    </div>
    <el-button
      style="width: 88%; margin: 0.8vh; background-color: hsl(0, 0%, 97%)"
      >编辑信息</el-button
    >
    <div class="otherSpan">
      <span>机构：</span><span>{{ data.instruction }}</span
      ><br />
      <span>地址：</span><span>{{ data.adress }} </span><br />
      <span>手机号：</span><span>{{ data.phone }} </span><br />
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import userApi from "@/api/user/user";

const api=new userApi()
const userInfo=JSON.parse(localStorage.getItem("userInfo"))
console.log(userInfo)
const router = useRouter(); //路由直接用router.push(...)
const route = useRoute();
const store = useStore(); //vuex直接用store.commit
const user_info = localStorage.getItem("userInfo");
const data = reactive({
  name: "ZZZ",
  email: "zzz@myzzz.zzz",
  description: "个人介绍是用来介绍自己的，所以要用个人介绍来介绍自己。",
  data_num: 5,
  instruction: "nnu",
  model_num: 5,
  task_num: 50,
  phone: "15689652365",
  adress: "江苏省南京市",
});
const init = () => {
  if (route.path != "/user/data") {
    document.getElementsByClassName("user-info")[0].style.opacity = 1;
  }
};
setTimeout(init, 109);
</script>

<style lang="less" scoped>
.user-span {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
}
// 兼容css
.img {
  color: aliceblue;
  width: 85%;
  // height: $width;
  margin-right: 8px;
  margin-top: 2%;
  margin-bottom: 4%;
  border-radius: 50%;
  background-color: rgb(20, 20, 20);
}

.infoSpan {
  text-align: left;
  margin-left: 5%;
  margin-right: 2.5%;
  line-height: 150%;
  font-size: 20px;
  width: 90%;
  h4 {
    margin: 0;
    font-size: 28px;
  }
}
.otherSpan {
  width: 90%;
  text-align: left;
  margin-left: 5%;
  margin-right: 2.5%;
  line-height: 150%;
  font-size: 18px;
}
</style>