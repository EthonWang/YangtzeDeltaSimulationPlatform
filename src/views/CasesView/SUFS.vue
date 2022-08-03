<template>
  <div>
    <iframe class="sufs" src="http://172.21.213.190:8888/" frameborder="0"></iframe>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps,defineEmits,watch } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit

</script>

<style lang="less" scoped>
// 兼容css
.sufs{
    width: 100vw;
    height: 100%;
}

</style>

