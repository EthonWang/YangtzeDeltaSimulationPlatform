<template>
  <div style="height: 100%; width: 100%">
    <div class="file-container">
      <div class="file" v-for="file in file_data" :key="file">
        <folder-opened style="width: 80%" />
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const file_data = reactive([
  {
    name: "changjiang",
    type: "folder",
    description: "changjiang is changjiang",
  },
  {
    name: "changjiang.shp",
    type: "shp",
    description: "changjiang is changjiang",
  },
]);
</script>

<style lang="less" scoped>
// 兼容css
.file-container {
  position: absolute;
  background: red;
  top: 10%;
  height: 90%;
  left: 0;
  width: 100%;
  display: flex;
  .file {
    position: relative;
    background: blue;
    height: 220px;
    width: $height * 3/4;
    text-align: center;
    
  }
}
</style>

