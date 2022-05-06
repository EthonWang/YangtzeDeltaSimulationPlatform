<template>
  <div>
    <div class="case-contain">
      <h1>案例中心</h1>
      <el-divider style="width: 100%"></el-divider>
      <el-scrollbar>
        <OneCase
          v-for="case_config in cases"
          :key="case_config"
          :img_url=case_config.img_path
          :tittle=case_config.name
          @click="toCase(case_config.path)"
          class="onecase"
        ></OneCase>
        <div
          style="float: left; position: relative; height: 50px; width: 100%"
        ></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import OneCase from "components/Cases/OneCase.vue";
import { cases_config } from "assets/config/cases.config.js";

const cases = reactive(cases_config);
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const toCase=(path)=>{
    router.push('/case/'+path)
}
</script>

<style lang="less" scoped>
.case-contain {
  position: relative;
  left: 16.5%;
  top: 2%;
  height: 85%;
  width: 65%;
  padding-bottom: 50px;
  .onecase {
    height: 240px;
    margin: 20px;
    float: left;
    width: 30%;
    position: relative;
  }
}
</style>

