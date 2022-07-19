<template>
  <div>
    <h1>This is an about page</h1>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import FileItemVue from "../User/UserFunctionCollection/FileItem.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const dataList = JSON.parse(localStorage.getItem("task")).dataList.filter(
  (item) => item.simularType != "model"
);


</script>

<style lang="less" scoped>
// 兼容css
</style>

