<template>
  <div style="display:flex;flex-direction: column; align-items: center">
    <video style="width: 99.5%;" src="@/assets/introduce/introduce.mp4" autoplay="autoplay" >
      <!-- <source :src="video" type="video/mp4"> -->
    </video>
  <el-button class="explore" @click="explore()">开始探索</el-button>
  </div>
</template>

<script setup>
import { reactive, computed, ref, defineProps,defineEmits,watch } from "vue";
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex";
const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit
const route=useRoute()
const userInfo=JSON.parse(localStorage.getItem("userInfo"))

const explore=()=>{
if(userInfo!=undefined){
  router.push('/user')
}else{
  router.push('/login')
}
}

</script>

<style lang="less" scoped>
.explore{
  position: absolute;
  left: 47%;
  top: 75%;
  background: transparent;
  color: white;
  font-size: 25px;
  padding: 15px 15px 15px 15px !important;
  height: fit-content;
}
</style>