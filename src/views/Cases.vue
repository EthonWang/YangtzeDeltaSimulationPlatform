<template>
  <div class="about">
    <div class="cases-page">
      <router-view style="width:100%;height:97.5%"></router-view>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import OneCase from "components/Cases/OneCase.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
</script>

<style lang="less" scoped>
.cases-page {
  position: absolute;
  top: 7.46vh;
  left: 8px;
  height: calc(100% - $top);
  width: calc(100% - $left);
  background-color: white;
  overflow: hidden;
}
</style>

