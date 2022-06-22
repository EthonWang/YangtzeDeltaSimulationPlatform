<template>
  <div style="" class="user-span">

      <img class="img-ava" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242306111155-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658408390&t=1968c63685cad0ef9295f811e27764f2" alt="">

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
        <el-button @click="logout"
      style="width: 88%;color: white; margin: 0.8vh; background-color: hsl(0, 100%, 70%)"
      >登出</el-button
    >
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
const logout=()=>{
  
  localStorage.clear()
  router.push('/login')
}
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
.img-ava {
  color: aliceblue;
  width: 85%;
  height: 36%;
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