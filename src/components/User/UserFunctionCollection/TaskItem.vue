<template>
  <div>
    <div class="task-item">
      <h3>
        {{ props.task.name }}任务
        <span
          class="task-public"
          v-if="props.task.public"
          ><el-icon><Unlock /></el-icon>公开</span
        >
        <span class="task-public task-private" v-if="!props.task.public"
          ><el-icon><Lock /></el-icon>私密</span
        >
      </h3>
      <p v-if="!edit_task">任务描述：{{ props.task.des }}</p>
      <p v-if="edit_task">
        <el-input
          v-model="task_data"
          autosize
          type="textarea"
          placeholder="Please input"
        />
      </p>
      <el-button class="btn_edit" v-if="!edit_task" @click="edit_task=!edit_task"
        ><el-icon><Edit /></el-icon>&nbsp;编辑描述</el-button
      >
      <el-button class="btn_edit" v-if="edit_task" @click="edit_task=!edit_task"
        ><el-icon><Edit /></el-icon>&nbsp;完成编辑</el-button
      >
      <el-button type="success" class="btn_public" v-if="!props.task.public"
        ><el-icon><Unlock /></el-icon>&nbsp;设为公开</el-button
      >
      <el-button type="warning" class="btn_public" v-if="props.task.public"
        ><el-icon><Lock /></el-icon>&nbsp;设为私密</el-button
      >
      <el-divider></el-divider>
      <span class="state">
        <span
          v-if="props.task.state == 'success'"
          style="color: hsl(120, 80%, 42%)"
          >任务完成！</span
        >
        <span
          v-if="props.task.state == 'processing'"
          style="color: hsl(220, 90%, 52%)"
          >任务进行中...</span
        >
        <span
          v-if="props.task.state == 'failure'"
          style="color: hsl(0, 50%, 52%)"
          >任务失败。</span
        >
      </span>
      <el-button type="primary" class="btn_view"
        ><el-icon><List /></el-icon>&nbsp;任务详情</el-button
      >
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  task: reactive({ Object }),
});
const emit = defineEmits(["update:task"]);
const task_data = ref(props.task.des);
const edit_task = ref(false);
watch(task_data, (newValue, oldValue) => {
  emit("update:task", newValue);
  //   console.log(newValue);
});
</script>

<style lang="less" scoped>
// 兼容css
.task-public {
  position: relative;
  padding: 8px;
  margin-left: 12px;
  font-size: 12px;
  color: rgb(61, 204, 56);
  border-radius: 5px;
  background-color: rgba(61, 204, 56, 0.1);
}
.task-private {
  color: rgb(228, 170, 10);
  background-color: rgba(228, 170, 10, 0.1);
}
.task-item {
  position: relative;
  border: 0.5px solid rgba(206, 206, 206, 0.5);
  margin: 5px;
  width: 100%;
  padding: 0 5% 2% 5%;
}
.btn_public {
  position: absolute;
  top: 6%;
  right: 5%;
}
.btn_view {
  position: absolute;
  right: 5%;
}
.btn_edit {
  position: absolute;
  right: 5%;
  top: 30%;
  background: rgb(231, 231, 231);
  font-weight: 800;
}
.state {
  font-size: 20px;
  font-weight: 500;
  font-style: italic;
}
p {
  width: 80%;
}
</style>

