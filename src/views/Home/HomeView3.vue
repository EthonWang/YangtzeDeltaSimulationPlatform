<template>
  <div style="display:flex;flex-direction: column; align-items: center">
    <video id="video" muted autoplay loading="lazy" preload="undefined" playsinline="playsinline">
      <source  src="@/assets/introduce/introduce.mp4" type="video/mp4">
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

const emit=defineEmits(['explore'])
const explore=()=>{
  emit('explore')
// if(userInfo!=undefined){
//   router.push('/user')
// }else{
//   router.push('/login')
// }
}
const showIntro=ref(false)

setTimeout(()=>{
  let element=document.getElementById("video")
  element.autoplay="true"
  console.log(element.autoplay);
  // element.addEventListener('click',function(e){},false)
  // // element.trigger('click')
  // element.click()
  // var event = document.createEvent('MouseEvents')
  // // 定义事件 参数： type, bubbles, cancelable
  // event.initEvent('click', true, true)
  // // 触发对象可以是任何元素或其他事件目标
  // element.dispatchEvent(event)
},200)
</script>

<style lang="less" scoped>
.explore{
  position: absolute;
  left: 47%;
  top: 55%;
  background: transparent;
  color: white;
  font-size: 25px;
  padding: 15px 15px 15px 15px !important;
  height: fit-content;
}
#video{
  width: 100%;
}
</style>