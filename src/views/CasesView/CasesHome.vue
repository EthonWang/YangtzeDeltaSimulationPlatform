<template>
  <div>
    <div class="case-contain">
      <OneCase
        v-for="case_config in cases"
        :key="case_config"
        :img_url="case_config.img_path"
        :tittle="case_config.name"
        :description="case_config.description"
        @click="toCase(case_config.path)"
        class="onecase"
      ></OneCase>
      <div
        style="float: left; position: relative; height: 20px; width: 100%"
      ></div>
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
const toCase = (path) => {
  router.push("/case/" + path + "/");
};
</script>

<style lang="less" scoped>
.case-contain {
  position: relative;
  left: 5%;
  top: 4%;
  height: 85%;
  width: 100% - 2*$left;
  padding-bottom: 50px;
  display: flex;
//   flex-direction: column;
      flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .scrollbar {
    height: 86%;
  }
  .onecase {
    height: 515px;
    margin: 1%;
    // margin-right: 0px;
    // float: left;
    // flex: 5;
    width: 22.5%;
    min-width: 350px;
    display: flex;
    flex-direction: column;
    // position: relative;
  }
}
</style>

