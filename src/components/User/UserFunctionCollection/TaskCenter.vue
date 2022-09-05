<template>
  <div style="width: 100%; height: 100%">
    <div style="margin-bottom: -10px">
      <el-button
        type="primary"
        @click="dialogFormVisible = true"
        style="width: 100%"
        ><el-icon><folder-add /></el-icon>&nbsp;新建实验室</el-button
      >
    </div>
    <el-divider></el-divider>
    <div style="height: 100%; width: 100%; padding-bottom: 100px">
      <TaskItem
        class="task"
        v-for="task in tasks"
        :key="task"
        :task="task"
        @update:task="task = $event"
        @delete-task="deleteTask(task)"
        @refresh="refresh"
      ></TaskItem>
    </div>
    <el-dialog v-model="dialogFormVisible" title="新建实验项目">
      <el-form :model="form">
        <el-form-item label="输入实验名称" :label-width="formLabelWidth">
          <el-input v-model="newTaskName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="面向科学专题" :label-width="formLabelWidth">
          <el-tree-select
            :popper-append-to-body="false"
            v-model="newTaskProblem"
            :data="options"
            placeholder="请选择"
            multiple
            show-checkbox
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createTask()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import TaskItem from "./TaskItem.vue";
import Api from "@/api/user/task";
import { ElMessage } from "element-plus";
import { random } from "lodash";
import { scienceChoose } from "@/assets/user/scienceChoose";
import { sciencePro } from "@/assets/data/home/sciencePro";
import { Decrypt } from "@/util/codeUtil";

const user_info = JSON.parse(Decrypt(localStorage.getItem("userInfo")));

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const api = new Api();
class task {
  constructor() {
    this.name = "";
    this.description = "";
    this.publicBoolean = false;
    this.problemTags = [];
    this.dataList = [];
    this.userId = String(new Date());
  }
}

const dialogFormVisible = ref(false);
const newTaskName = ref("");
const newTaskProblem = ref([]);
const tasks = ref([]);
const task_origin = ref([]);
watch(
  () => scienceChoose.value,
  (newval, oldval) => {
    tasks.value = task_origin.value.filter((item) => {
      if (
        item.problemTags == "" ||
        item.problemTags == [] ||
        item.problemTags == null
      ) {
        if (newval.includes("未分类")) {
          return item;
        }
      } else {
        for (let i = 0; i < item.problemTags.length; i++) {
          const el = item.problemTags[i];
          if (scienceChoose.value.includes(el)) {
            return item;
          }
        }
      }
    });
  }
);
//更新数据时联动问题面板进行筛选
watch(
  () => task_origin.value,
  (newval, oldval) => {
    tasks.value = newval.filter((item) => {
      if (item.problemTags == "" || item.problemTags == []) {
        if (scienceChoose.value.includes("未分类")) {
          return item;
        }
      } else {
        for (let i = 0; i < item.problemTags.length; i++) {
          const el = item.problemTags[i];
          if (scienceChoose.value.includes(el)) {
            return item;
          }
        }
      }
    });
  }
);

const options = Array.from({ length: sciencePro.length }).map((_, idx) => {
  const label = idx;
  return {
    value: sciencePro[label].name.replace("\n", "").replace("\r", ""),
    label: sciencePro[label].name.replace("\n", "").replace("\r", ""),
    children: Array.from({ length: sciencePro[label].children.length }).map(
      (_, idx1) => ({
        value: sciencePro[label].children[idx1].name
          .replace("\n", "")
          .replace("\r", ""),
        label: sciencePro[label].children[idx1].name
          .replace("\n", "")
          .replace("\r", ""),
      })
    ),
  };
});

const refresh = () => {
  api.getTaskList(user_info.id).then((res) => {
    task_origin.value = [];
    for (let i = res.data.data.length - 1; i >= 0; i--) {
      for (let j in res.data.data[i].dataList) {
        let it = res.data.data[i].dataList[j].problemTags;
        if (it && typeof it == "string") {
          res.data.data[i].dataList[j].problemTags =
            res.data.data[i].dataList[j].problemTags.split(",");
        } else {
          res.data.data[i].dataList[j].problemTags = ["未分类"];
        }
        let item = res.data.data[i].dataList[j].normalTags;
        if (item && typeof item == "string") {
          res.data.data[i].dataList[j].normalTags =
            res.data.data[i].dataList[j].normalTags.split(",");
        } else {
          res.data.data[i].dataList[j].normalTags = ["未分类"];
        }
      }

      task_origin.value.push(res.data.data[i]);
    }
  });
};

const createTask = () => {
  let new_task = new task();
  new_task.name = newTaskName.value;
  new_task.userId = user_info.id;
  new_task.problemTags = newTaskProblem.value;
  dialogFormVisible.value = false;
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
  margin: 5px 0 10px 0;
}
</style>

