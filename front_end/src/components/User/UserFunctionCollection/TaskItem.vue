<template>
  <div>
    <div class="task-item">
      <h2 v-if="!edit_task"><span>实验室：</span>{{ props.task.name }}</h2>
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
        <el-form-item label="面向专题">
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
        @click="myDataVisible = true"
        >选择并添加<strong>我的数据</strong></el-button
      >
      <el-button
        v-if="!edit_task"
        @click="ResourseVisible = true"
        style="float: left; margin-right: 5px"
        >选择并添加<strong>公共资源</strong></el-button
      >
      <br /><br />
      <!-- <el-divider></el-divider> -->
      <el-button
        v-if="!edit_task"
        @click="recommendVisible = !recommendVisible"
        style="margin-left: 5px; position: relative; z-index: 1"
      >
        <span v-if="recommendVisible"
          >收起</span
        ><span v-else
          >查看</span
        >
        <strong style="color: hsl(140, 100%, 40%)">推荐资源</strong></el-button
      >
      <br />
      <div style="margin: 10px"></div>
      <div
        style="
          width: fit-content;
          display: flex;
          opacity: 0.85;
          padding: 40px 5px 5px 5px;
          margin-top: -47px;
          margin-bottom: 15px;
          border-radius: 5px;
          background-color: hsl(150, 100%, 95%);
        "
        v-if="recommendVisible&&!edit_task"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          v-for="data in recommendData"
          :key="data"
          @click="recommendShow(data)"
          style="margin: 5px; cursor: pointer; width: 150px"
        >
          <!-- <img
          v-if="!(imgWebAddress in data)"
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ftenfei02.cfp.cn%2Fcreative%2Fvcg%2Fveer%2F612%2Fveer-151591516.jpg&refer=http%3A%2F%2Ftenfei02.cfp.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664635359&t=868a15b9dca36642df90c3d70c861e9a"
            alt=""
            style="width: 150px; height: 100px"
          /> -->
          <img
            v-if="data.imgWebAddress.includes('http://')"
            :src="data.imgWebAddress"
            style="width: 150px; height: 100px"
          />
          <img
            v-else
            :src="dataServer + data.imgWebAddress"
            style="width: 150px; height: 100px"
          />
          <div style="padding: 5px">
            <div
              style="
                margin-top: 13px;
                line-height: 150%;
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <span>{{ data.name }}</span>
            </div>
          </div>
        </el-card>
      </div>
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
          
            v-if="data.simularTrait != 'model' && data.simularTrait != 'task'"
          >
          <template #label>
            <span v-if="!edit_task">{{data.name.slice(0, 50)}}</span>
            <el-input
            v-if="edit_task"
            v-model="data.name"
            autosize
            type="textarea"
            placeholder="请输入描述"
          />
          </template>
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
    <!-- 删除实验确认 -->
    <el-dialog v-model="centerDialogVisible" title="删除实验" width="30%">
      <span>删除后无法恢复，确认删除？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteTask()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加我的数据 -->
    <el-dialog v-model="myDataVisible" width="60%" draggable @close="refresh">
      <DataCenter style="width: 40vw; height: 60vh"></DataCenter>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            style="position: relative; z-index: 5"
            @click="myDataVisible = false"
            >退出</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 添加平台数据 -->
    <div class="resourceDialog">
      <el-dialog
        v-model="ResourseVisible"
        width="100%"
        draggable
        @close="refresh"
      >
        <Resourse
          style="width: 100vw; height: 60vh"
          :data_recommend="data_recommend"
        ></Resourse>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              style="position: relative; z-index: 5"
              @click="ResourseVisible = false"
              >退出</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- <el-dialog
      v-model="recommendVisible"
      title="推荐数据"
      width="30%"
      @close="refresh"
    >
      <el-button
        v-for="data in recommendData"
        :key="data"
        @click="recommendShow(data)"
        style="margin: 5px"
      >
        <el-icon><Document /></el-icon>&nbsp; ><span>{{
          data.name
        }}</span></el-button
      >

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="recommendVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { sciencePro } from "@/assets/data/home/sciencePro";
import taskApi from "@/api/user/task";
import { Encrypt, Decrypt } from "@/util/codeUtil";
import DataCenter from "@/components/User/UserFunctionCollection/DataCenter.vue";
import ScienceProblemData from "@/components/User/UserFunctionCollection/ScienceProblemData.vue";
import Resourse from "@/views/Resourse.vue";
import graphAPI from "@/api/user/graph";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus/lib/components";

const task_api = new taskApi();
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const dataServer = store.getters.devIpAddress;
const props = defineProps({
  task: reactive(Object),
});
const centerDialogVisible = ref(false);
const emit = defineEmits(["update:task", "deleteTask", "refresh"]);
const task_data = ref(props.task);
const edit_task = ref(false);
const ResourseVisible = ref(false);
watch(task_data, (newValue, oldValue) => {
  emit("update:task", newValue);
  //   console.log(newValue);
});

const refresh = () => {
  emit("refresh");
};
const myDataVisible = ref(false);
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

//推荐数据
const recommendVisible = ref(true);
const show_task = ref(false);
const recommendData = ref([]);
const graphApi = new graphAPI();
const data_recommend = ref("");
let dataNameList = [];
for (let i in props.task.dataList) {
  // dataNameList.push(props.task.dataList[i].name);
  for (let j in props.task.dataList[i].problemTags) {
    dataNameList.push(props.task.dataList[i].problemTags[j]);
  }
  for (let j in props.task.dataList[i].normalTags) {
    dataNameList.push(props.task.dataList[i].normalTags[j]);
  }
}
for (let i in props.task.problemTags) {
  dataNameList.push(props.task.problemTags[i]);
}
let obj = {};
dataNameList.forEach((item) => (obj[item] = item));
let a = [];
for (let key in obj) {
  a.push(obj[key]);
}
dataNameList = a;
graphApi.giveRecommend(dataNameList).then((res) => {
  recommendData.value = res;
});
// setTimeout(() => {
//   recommendData.value = graphApi.giveRecommend(dataNameList);
// }, 1200);

const recommendShow = (data) => {
  if (
    !data.visualizationBoolean &&
    data.fileWebAddress != "" &&
    data.md5 == undefined
  ) {
    ElMessageBox.confirm(
      "数据名：" +
        data.name +
        "，即将前往“国家地球科学数据中心-长江三角洲分中心”，您可下载数据后上传到 [ 实验室 - 我的数据 ] 中使用。",
      "外站数据",
      {
        confirmButtonText: "前往",
        cancelButtonText: "取消",
      }
    )
      .then(() => {
        window.open(data.fileWebAddress);
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消操作",
        });
      });
  } else if (data.private == "resource") {
    data_recommend.value = data.name;
    ResourseVisible.value = true;
  } else if (data.type=="model"){
    data_recommend.value = data.name;
    ResourseVisible.value = true;
  }
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
  background: hsl(0, 0, 97%);
  &:hover {
    border: 1px solid rgba(81, 113, 255, 0.85);
    background: hsl(220, 100%, 94%);
  }
  strong {
    color: hsl(210, 100%, 60%);
    font-weight: 600;
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
/deep/.el-form-item__content,
.el-tag {
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

/deep/.file-container{
  width: 92%;
}
/deep/.file-operation{
  width: 92%;
}
/deep/.file-controller{
  height: calc(98% - 60px);
}
/deep/.file-detail-controller{
  height: calc(98% - 120px);
  right: 3%;
}

.resourceDialog/deep/.el-dialog {
  padding: 0;
  background: #1b233a;
  .el-dialog {
    padding: 5px;
    background: #fafafa;
  }
  .el-dialog__body {
    padding: 0;
    .main {
      margin-top: 20px;
    }
  }
}
</style>

