<template>
  <div style="height: 100%; width: 100%">
    <TaskItem
      class="task"
      v-for="task in tasks"
      :key="task"
      :task="task"
      @update:task="task.des=$event"
    ></TaskItem>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import TaskItem from "./TaskItem.vue";

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const tasks = reactive([
  {
    name: "SWMM模型",
    des: "本任务作为SWMM模型应用的典型案例，现在共享出来方便大家学习。",
    state: "success",
    public: true,
  },
  {
    name: "SWMM模型",
    des: "本任务作为SWMM模型应用的典型案例，现在共享出来方便大家学习。",
    state: "processing",
    public: false,
  },
  {
    name: "SWMM模型",
    des: "本任务作为SWMM模型应用的典型案例，现在共享出来方便大家学习。",
    state: "failure",
    public: false,
  },
]);
</script>

<style lang="less" scoped>
// 兼容css
.task {
  width: 90%;
}
</style>

