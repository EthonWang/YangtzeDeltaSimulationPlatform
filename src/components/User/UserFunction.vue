<template>
  <div style="width:100% ;height:100% ;">
    <div class="tabs-page">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="数据中心" name="first">
          <DataCenter class="data-center"></DataCenter>
        </el-tab-pane>
        <el-tab-pane label="模型中心" name="second">Config</el-tab-pane>
        <el-tab-pane label="任务中心" name="third">Role</el-tab-pane>
        <el-tab-pane label="其他" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import DataCenter from "./UserFunctionCollection/DataCenter.vue";
const router = useRouter()//路由直接用router.push(...)
const store = useStore()//vuex直接用store.commit
const activeName = ref("first")
</script>

<style lang="less" scoped>
// 兼容css
.tabs-page {
  position: absolute;
  width: 100%;
  height: 90%;
  top: 1.6vh;

  /deep/ .el-tabs__nav {
    margin-left: 3vw;

    .el-tabs__item {
      font-size: .9vw;
      margin-right: 2vw;
    }
  }

  /deep/ .el-tabs__content {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
      background-color: aqua;
  }
}

.demo-tabs {
  width: 100%;
  height: 100%;
}

.data-center {
  width: 90%;
  height: 100%;

}
</style>