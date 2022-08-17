<template>
  <div>
    <div class="task-item">
      <h2 v-if="!edit_task"><span>实验：</span>{{ props.task.name }}</h2>
      <el-input
        style="
          width: 40%;
          font-size: 18px !important;
          padding: 10px;
          margin-left: -12px;
        "
        v-if="edit_task"
        v-model="task_data.name"
        placeholder="请输入标题"
      />
      <span class="task-public" v-if="props.task.publicBoolean"
        ><el-icon><Unlock /></el-icon>公开</span
      >
      <span class="task-public task-private" v-if="!props.task.publicBoolean"
        ><el-icon><Lock /></el-icon>私密</span
      >
      <br />
      <el-form
        :label-position="labelPosition"
        label-width="160px"
        :model="task_data"
        style="max-width: calc(95% - 130px)"
      >
        <el-form-item label="实验描述">
          <span v-if="!edit_task">{{ props.task.description }}</span>

          <el-input
            v-if="edit_task"
            v-model="task_data.description"
            autosize
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="面向科学问题">
          <el-tag
            v-for="item in props.task.problemTags"
            :key="item.label"
            class="mx-1"
            style="margin: 2px"
            v-show="!edit_task"
            >{{ item }}
          </el-tag>

          <el-tree-select
            :popper-append-to-body="false"
            v-model="task_data.problemTags"
            :data="options"
            multiple
            show-checkbox
            v-show="edit_task"
          />
        </el-form-item>
      </el-form>
      <el-button
        class="btn_edit"
        v-if="!edit_task"
        @click="edit_task = !edit_task"
        ><el-icon><Edit /></el-icon>&nbsp;编辑</el-button
      >
      <el-button
        class="btn_edit"
        type="success"
        v-if="edit_task"
        @click="confirmEdit()"
        ><el-icon><Edit /></el-icon>&nbsp;完成</el-button
      >
      <!-- <el-button type="success" class="btn_public" v-if="!props.task.public"
        ><el-icon><Unlock /></el-icon>&nbsp;设为公开</el-button
      >
      <el-button type="warning" class="btn_public" v-if="props.task.public"
        ><el-icon><Lock /></el-icon>&nbsp;设为私密</el-button
      > -->
      <el-divider></el-divider>

      <el-button
        v-if="!edit_task"
        style="float: left; margin-right: 5px"
        @click="router.push('/user/data')"
        >选择并添加<strong>我的云端</strong>数据</el-button
      >
      <!-- <el-upload
      v-if="!edit_task"
        style="float: left; margin-right: 5px"
        class="upload-demo"
        action=""
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="10"
        :on-change="handleChange"
        :on-exceed="handleExceed"
       :before-upload="beforeUpload"
        :file-list="fileList"
      >
        <el-button>选择并添加<strong>本地</strong>数据</el-button>
      </el-upload> -->

      <el-button
        v-if="!edit_task"
        @click="router.push('/resourse')"
        style="float: left; margin-right: 5px"
        >选择并添加<strong>公共资源</strong></el-button
      >
      <br />
      <div style="margin: 30px"></div>
      <el-form
        :inline="true"
        :label-position="labelPosition"
        label-width="200px"
        :model="task_data"
        style="max-width: 80%"
        class="data-list demo-form-inline data-model"
      >
        <h4>数据配置：</h4>
        <template v-for="(data, index) in props.task.dataList" :key="data">
          <el-form-item
            :label="data.name.slice(0, 25)"
            v-if="data.simularTrait != 'model' && data.simularTrait != 'task'"
          >
            <el-button
              type="success"
              v-if="!edit_task"
              disabled
              circle
              size="small"
              ><el-icon><Check /></el-icon
            ></el-button>
            <el-button
              type="danger"
              v-if="edit_task"
              circle
              size="small"
              @click="deleteData(index)"
              ><el-icon><Close /></el-icon
            ></el-button>
          </el-form-item>
        </template>
      </el-form>
      <div style="margin: 15px"></div>
      <el-form
        :inline="true"
        :label-position="labelPosition"
        label-width="200px"
        :model="task_data"
        style="max-width: 80%"
        class="data-list demo-form-inline data-model"
      >
        <h4>模型配置：</h4>
        <template v-for="(data, index) in props.task.dataList" :key="data">
          <el-form-item :label="data.name" v-if="data.simularTrait == 'model'">
            <el-button
              type="success"
              v-if="!edit_task"
              disabled
              circle
              size="small"
              ><el-icon><Check /></el-icon
            ></el-button>
            <el-button
              type="danger"
              v-if="edit_task"
              circle
              size="small"
              @click="deleteData(index)"
              ><el-icon><Close /></el-icon
            ></el-button>
          </el-form-item>
        </template>
      </el-form>
      <el-button
        type="primary"
        class="btn_view"
        @click="gotoLiboratory(props.task)"
        v-if="!edit_task"
        ><el-icon><Checked /></el-icon>&nbsp;进入实验室</el-button
      >
      <el-button
        type="danger"
        v-if="edit_task"
        class="btn_delete"
        @click="centerDialogVisible = true"
        ><el-icon><CloseBold /></el-icon>&nbsp; 删除本实验</el-button
      >
    </div>
    <el-dialog v-model="centerDialogVisible" title="删除实验" width="30%">
      <span>删除后无法恢复，确认删除？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteTask()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { sciencePro } from "@/assets/data/home/sciencePro";
import taskApi from "@/api/user/task";
import { Encrypt,Decrypt } from "@/util/codeUtil"

const task_api = new taskApi();
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  task: reactive(Object),
});
const centerDialogVisible = ref(false);
const emit = defineEmits(["update:task", "deleteTask"]);
const task_data = ref(props.task);
const edit_task = ref(false);
watch(task_data, (newValue, oldValue) => {
  emit("update:task", newValue);
  //   console.log(newValue);
});

const gotoLiboratory = (task) => {
  localStorage.setItem("task", Encrypt(JSON.stringify(task)));
  router.push("/model");
};

const labelPosition = ref("left");

const deleteData = (index) => {
  task_data.value.dataList.splice(index, 1);
};
const handleChange = (file, fileList) => {
  let path = document.getElementsByClassName("el-upload__input")[0].value;
  task_data.value.dataList.push({
    id: path,
    source: "local",
    name: file.name,
  });
};

const beforeUpload = (rawFile) => {
  return false;
};

const confirmEdit = () => {
  edit_task.value = !edit_task.value;
  task_api.editTask(task_data.value);
};

const options = Array.from({ length: sciencePro.length }).map((_, idx) => {
  const label = idx;
  return {
    value: sciencePro[label].name.replace("\n", ""),
    label: sciencePro[label].name.replace("\n", ""),
    children: Array.from({ length: sciencePro[label].children.length }).map(
      (_, idx1) => ({
        value: sciencePro[label].children[idx1].name.replace("\n", ""),
        label: sciencePro[label].children[idx1].name.replace("\n", ""),
      })
    ),
  };
});
const deleteTask = () => {
  centerDialogVisible.value = false;
  emit("deleteTask", props.task);
};
const handleClose = (tag) => {
  task_data.value.problemTags.splice(
    task_data.value.problemTags.indexOf(tag),
    1
  );
};
</script>

<style lang="less" scoped>
// 兼容css
h2 {
  font-size: 22px;
  color: hsl(210, 100%, 40%);
}
h4 {
  font-size: 19px;
}
.task-public {
  position: absolute;
  top: 15px;
  right: calc(5% + 90px);
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
  border: 1px solid rgba(206, 206, 206, 0.75);
  width: 100%;
  padding: 2% 5% 35px 5%;
  transition: all 0.5s;
  &:hover {
    border: 1px solid rgba(81, 113, 255, 0.85);
  }
  strong {
    color: hsl(210, 100%, 60%);
  }
}
.btn_public {
  position: absolute;
  top: 15px;
  right: 5%;
}
.btn_view {
  position: absolute;
  right: 5%;
  bottom: 35px;
}
.btn_delete {
  position: absolute;
  right: 5%;
  bottom: 35px;
  // background: rgb(231, 231, 231);
  font-weight: 800;
}
.btn_edit {
  position: absolute;
  right: 5%;
  top: 15px;
  // background: rgb(231, 231, 231);
  font-weight: 800;
}
.state {
  font-size: 20px;
  font-weight: 500;
  font-style: italic;
}
// p {
//   width: calc(80% - 100px);
// }
/deep/.data-model.el-form--label-left .el-form-item__label {
  text-align: left;
  overflow: hidden !important;
  line-height: 120% !important;
}

/deep/.el-form--label-left .el-form-item__label {
    font-size: 17px;
}
.data-list {
  transition: all 0.5s;
  /deep/ .el-form-item {
    transition: all 0.5s;
    --font-size: 14px;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-right: 10%;
    animation: come 1s linear 1;
    @keyframes come {
      0% {
        transform: translateX(-300px);
        opacity: 0.1;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }
}
</style>

