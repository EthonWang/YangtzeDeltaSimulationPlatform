<template>
  <div style="display:flex;flex-direction: column; align-items: center">
    <video style="width: 80%;margin-top:1% ;" controls="controls"  :src="video">
      <!-- <source :src="video" type="video/mp4"> -->
    </video>

  </div>
</template>

<script setup>
import { reactive, computed, ref, defineProps,defineEmits,watch } from "vue";
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex";
const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit
const route=useRoute()

const video=ref("")
if ("data" in route.query) {
  video.value = route.query.data ;
}
console.log(route)


</script>

<style lang="less" scoped>
</style>