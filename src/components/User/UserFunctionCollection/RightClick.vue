<template>
  <div>
    <div
      style="
        background-color: white;
        box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
        padding-top: 5%;
        padding-bottom: 5%;
        height: 100%;
        width: 100%;
      "
    >
      <div class="opt" @click="comeIn()" v-if="props.file.type == 'folder'">
        <el-icon><FolderOpened /></el-icon>&nbsp;进入
      </div>
      <!-- <div class="opt" @click="emit('edit_r')">
        <el-icon><Edit /></el-icon>&nbsp;编辑
      </div> -->
      <div class="opt" @click="downloadData">
        <el-icon><Download /></el-icon>&nbsp;下载({{ props.num }})
      </div>
      <!-- <div class="opt">
        <el-icon><Bicycle /></el-icon>&nbsp;移动
      </div> -->

      <div class="opt" @click="deleteData">
        <el-icon><Delete /></el-icon>&nbsp;删除({{ props.num }})
      </div>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { ElMessage } from "element-plus/lib/components";
import { rename } from "fs";
import {
  reactive,
  computed,
  ref,
  defineProps,
  defineExpose,
  defineEmits,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  file: Object,
  num: Number,
});
const emit = defineEmits(["comeIn_r", "downloadData", "deleteData"]);
// const rename=()=>{

// }
const downloadData = () => {
  emit("downloadData");
};
const deleteData = () => {
  emit("deleteData");
};
const comeIn=()=>{
  console.log(props.file)
  emit("comeIn_r",props.file)
}

</script>

<style lang="less" scoped>
// 兼容css
.opt {
  width: 100% - $padding-left;
  height: 30px;
  text-align: left;
  cursor: pointer;
  padding: 2.5%;
  padding-left: 12.5%;
  align-items: center;
  display: flex;
  &:hover {
    background-color: #d1d1d193;
  }
}
</style>

