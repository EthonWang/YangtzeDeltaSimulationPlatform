<template>
  <div style="width: 100%; height: 100%">
    <div style="margin-bottom: -10px">
      <el-button type="primary" @click="createTask()" style="width: 100%"
        ><el-icon><folder-add /></el-icon>&nbsp;新建实验</el-button
      >
    </div>
    <el-divider></el-divider>
    <div
      style="
        height: 100%;
        width: 100%;
        justify-content: center;
      "
    >
      <TaskItem
        class="task"
        v-for="task in tasks"
        :key="task"
        :task="task"
        @update:task="task = $event"
        @delete-task="deleteTask(task)"
      ></TaskItem>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import TaskItem from "./TaskItem.vue";
import Api from "@/api/user/task";
import { ElMessage } from "element-plus";
import { random } from "lodash";
const user_info=JSON.parse(localStorage.getItem("userInfo"))




const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const api = new Api();
class task {
  constructor() {
    this.name = "";
    this.description = "";
    this.publicBoolean = false;
    this.problemTags = "";
    this.dataList = [];
    // this.id = String(new Date());
  }
}

const tasks = ref([]);
const refresh = () => {
  api.getTaskList(user_info.id).then((res) => {
    console.log(res.data.data);
    tasks.value = [];
    for(let i in res.data.data)
    {tasks.value.push(res.data.data[i])}
    console.log(tasks.value);
  });
};

const createTask = () => {
  let new_task = new task()
  console.log(new_task);
  api.createTask(new_task).then((res) => {
    refresh();
  });
};

const deleteTask = (task) => {
  api.deleteTask(task).then((res) => {
    refresh();
  });
};

setTimeout(() => {
  refresh();
}, 320);
</script>

<style lang="less" scoped>
// 兼容css
.task {
  width: calc(100% - 10px);
  margin: 5px;
}
</style>

