<template>
  <div style="height: 100%; width: 100%">
    <div style="position: absolute; width: 79%; height: 100%">
      <div class="file-operation">
        <!-- <el-button @click="showScience" id="expand"
        style="border: 0;"
      ><el-icon style="transform: scale(2) rotateY(180deg);"><Expand /></el-icon></el-button> -->
        <el-button round @click="back"
          ><el-icon><d-arrow-left /></el-icon>&nbsp;返回</el-button
        >
        <el-button round @click="refresh"
          ><el-icon><Refresh /></el-icon>&nbsp;刷新</el-button
        >
        <el-button type="primary" @click="dialogVisible = true"
          ><el-icon><Upload /></el-icon>&nbsp;上传数据</el-button
        >
        <el-button type="primary" @click="createFolder()"
          ><el-icon><folder-add /></el-icon>&nbsp;新建文件夹</el-button
        >

        <el-breadcrumb :separator-icon="ArrowRight" style="margin-left: 2%">
          <el-breadcrumb-item v-for="item in breadcrumbs" :key="item">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="file-container">
        <div
          style="position: absolute; width: 100%; height: 100%"
          @click="choose(null, -1)"
        ></div>
        <FileItem
          v-for="(file, index) in file_data"
          :key="file"
          :prop_file="file"
          :prop_index="index"
          @choose_f="choose(file, index)"
          @comeIn_f="comeIn(file)"
          @create-folder_f="createFolder(index)"
          @contextmenu.prevent="rightClick($event, file, index)"
        ></FileItem>
      </div>
    </div>
    <RightClick
      v-show="show_right"
      class="right-click"
      :file="show_file"
      :num="choose_num"
      @comeIn_r="comeIn(file)"
      @deleteData="deleteData"
      @downloadData="downloadData"
    ></RightClick>
    <div
      style="
        position: absolute;
        background-color: hsla(220, 15%, 94%, 0.5);
        width: 20%;
        right: 0;
        height: 100%;
      "
    >
      <FileDetail
        style="width: 100%; height: 100%"
        :file="show_file"
        :num="choose_num"
        @update:file="show_file = $event"
        @deleteData="deleteData"
        @downloadData1="downloadData"
        @addToTask="addToTask()"
      ></FileDetail>
    </div>
    <el-dialog
      v-model="dialogVisible"
      style="position: fixed"
      title="新数据"
      width="40%"
      :before-close="handleClose"
    >
      <template #default>
        <el-form :model="upload_file">
          <el-form-item label="数据描述" :label-width="data_des_width">
            <el-input v-model="upload_file.description" autocomplete="off" />
          </el-form-item>
          <el-form-item label="数据所属" :label-width="data_des_width">
            <el-tree-select
              :popper-append-to-body="false"
              v-model="upload_file.problemTags"
              :data="options"
              multiple
              show-checkbox
            />
          </el-form-item>
          <el-form-item label="开放状态" :label-width="data_des_width">
            <el-switch
              v-model="upload_file.publicBoolean"
              class="mb-2"
              active-text="公有"
              inactive-text="私有"
            />
          </el-form-item>
        </el-form>
        <el-dialog
          v-model="innerVisible"
          width="30%"
          title="选择数据"
          append-to-body
        >
          <el-upload
          v-model:file-list="fileList"
            class="upload-demo"
            action="/back/resource/saveDataItem"
            :headers="upload_header"
            :data="{
              name: upload_file.name,
              description: upload_file.description,
              problemTags: upload_file.problemTagsString,
              publicBoolean: upload_file.publicBoolean,
              parentId: now_id,
            }"
            :on-success="successUpload"
            :before-upload="beforeUpload"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖拽至此或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">一次上传一个数据</div>
            </template>
          </el-upload>
        </el-dialog>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="innerVisible = true"
            >选择数据</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="show_task"
      title="选择已有实验"
      width="30%"
      :before-close="handleClose"
    >
      <el-button
        v-for="task in task_list"
        :key="task"
        @click="addDataToTask(task)"
      >
        <el-icon><Monitor /></el-icon> &nbsp; {{ task.name }}</el-button
      >

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show_task = false">取消</el-button>
          <el-button type="primary" @click="show_task = false">完成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- <div class="arrow">>>>>>>>>>>>>>>>>>>>></div>
  <div class="arrow ani">></div> -->
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ArrowRight } from "@element-plus/icons-vue";
import RightClick from "./RightClick.vue";
import Api from "@/api/user/data";
import taskApi from "@/api/user/task";
import FileDetail from "./FileDetail.vue";
import { time } from "echarts";
import { ElMessage } from "element-plus/lib/components";
import { sciencePro } from "@/assets/data/home/sciencePro";
import { relation, initRelation } from "@/assets/data/another/relation";
import FileItem from "./FileItem.vue";
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const task_api = new taskApi();
const show_task = ref(false);
const task_list = ref([]);

const upload_header = { token: localStorage.getItem("token") };
task_api.getTaskList(userInfo.id).then((res) => {
  for (let i in res.data.data) {
    task_list.value.push(res.data.data[i]);
  }
});
const fileList = ref([
])
const addToTask = () => {
  show_task.value = true;
};
const addDataToTask = (task) => {
  console.log(task);
  let dataList = [];
  for (let i in choosing_files) {
    if (choosing_files[i].type != "folder") {
      let data = {
        name: choosing_files[i].name,
        id: choosing_files[i].id,
        source: "cloud",
        type: "data",
        visualizationBoolean: false,
        visualWebAddress: choosing_files[i].visualWebAddress,
        visualType: choosing_files[i].name.split(".")[1],
        geoType: "line",
        fileRelativePath: choosing_files[i].fileRelativePath,
        fileWebAddress: choosing_files[i].fileWebAddress,
        fileStoreName: choosing_files[i].fileStoreName,
      };
      dataList.push(data);
    }
  }
  task_api.addData(task, dataList);
  show_task.value = false;
};
var upload_file = ref({
  name: "",
  description: "",
  problemTags: [],
  publicBoolean: false,
  problemTagsString: computed(() => {
    return upload_file.value.problemTags.toString();
  }),
  normalTags: [],
  normalTagsString: computed(() => {
    return upload_file.value.normalTags.toString();
  }),
});
const data_des_width = "100px";
const data_describ = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const api = new Api();

const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const dialogVisible = ref(false);
const innerVisible = ref(false);
const file_data = ref([
  {
    id: "565666",
    name: "长江",
    type: "folder",
    description: "",
    rename: false,
    publicBoolean: false,
    time: "2022/12/12",
    author: "NNU",
    problemTags: "",
  },
]);
const breadcrumbs = reactive(["主页"]);
const show_right = ref(false);
const right_file = ref(Object);

setTimeout(() => {
  refresh();
}, 320);
const successUpload = () => {
  innerVisible.value = false;
  dialogVisible.value=false;
  fileList.value=[]
  upload_file.value = {
    name: "",
    description: "",
    problemTags: [],
    publicBoolean: false,
    problemTagsString: computed(() => {
      return upload_file.value.problemTags.toString();
    }),
    normalTags: [],
    normalTagsString: computed(() => {
      return upload_file.value.normalTags.toString();
    }),
  };
  refresh();
};
const now_id = ref(userInfo.id);
var last_id = [];
const createFolder = (index = -1) => {
  if (index != -1) {
    api.createFolder(now_id.value, file_data.value[index].name).then((res) => {
      file_data.value[index].rename = false;
      refresh();
      return;
    });
  }
  if (index == -1) {
    file_data.value.push({
      id: "5689",
      name: "",
      type: "folder",
      description: "新建文件夹",
      rename: true,
      publicBoolean: false,
      time: "2022/12/12",
      author: "NNU",
      problemTags: "",
    });
  }
};
const options = Array.from({ length: sciencePro.length }).map((_, idx) => {
  const label = idx;
  return {
    value: sciencePro[label].name,
    label: sciencePro[label].name,
    children: Array.from({ length: sciencePro[label].children.length }).map(
      (_, idx1) => ({
        value: sciencePro[label].children[idx1].name,
        label: sciencePro[label].children[idx1].name,
      })
    ),
  };
});
const beforeUpload = (rawFile) => {
  for (let i in file_data.value) {
    if (rawFile.name == file_data.value[i].name) {
      console.log("errrr");
      ElMessage.error("存在同名文件");
      return false;
    }
  }
  upload_file.value.name = rawFile.name;
  return true;
};
const uploadFile = (file_artribute, file_data) => {
  let file_send = file_artribute;
  file_send["data"] = file_data;
  api.uploadFile(file_send).then(() => {
    refresh();
  });
};

const refresh = () => {
  api.getFile(now_id.value).then((res) => {
    console.log(res.data[0]);
    for (let i in res.data) {
      let data = JSON.parse(JSON.stringify(res.data[i]));
      data.name = data.name.split(".")[0];
      if (res.data[i].problemTags[0] != "" && res.data[i].problemTags != []) {
        res.data[i].problemTags = data.problemTags.split(",");
      }
    }
    file_data.value = res.data;
    choose_num.value=0;
    choosing_files = [];
    choosing_files_index = [];
    ElMessage({
      type: "success",
      message: "数据获取成功",
    });
  });

};
const comeIn = (file) => {
  console.log(file);
  last_id.push(now_id.value);
  now_id.value = reactive(file.id);
  console.log(now_id.value);
  breadcrumbs.push(file.name);
  refresh();
};
const back = () => {
  if (last_id.length == 0) {
    return;
  }
  now_id.value = last_id.pop();
  breadcrumbs.pop();
  refresh();
};

const confirmChange = (type, index) => {};
const downloadData = () => {
  console.log("asdajksdjkasdkjasd");
  for (let i in choosing_files) {
    let file = choosing_files[i];
    console.log(file);
    if (file.type == "folder") {
      ElMessage.error('无法下载文件夹')
      // api.downloadFolder(file).then(() => {
      //   ElMessage({
      //     message: "下载成功",
      //     type: "success",
      //   });
      // });
    }
    api.downloadFile(file).then(() => {
      ElMessage({
        message: "下载成功",
        type: "success",
      });
    });
  }
};
const rightClick = (event, file, index) => {
  right_file.value = file;
  right_file.value["index"] = index;
  choose(file, index);
  show_right.value = false;
  show_right.value = true;
  let menu = document.getElementsByClassName("right-click")[0];
  menu.style.left = event.clientX + "px";
  menu.style.top = event.clientY + "px";
  const cancelRight = () => {
    show_right.value = false;
    document.removeEventListener("click", cancelRight);
  };
  document.addEventListener("click", cancelRight);
};
let last_click = 0;
const show_file = ref(file_data.value[0]);

const choose_num = ref(0);
let choosing_files = [];
let choosing_files_index = [];

const choose = (file, index) => {
  if (index == -1) {
    for (let i in choosing_files_index) {
      document.getElementsByClassName("file")[
        choosing_files_index[i]
      ].style.backgroundColor = "";
    }
    choosing_files_index = [];
    choosing_files = [];
    choose_num.value = 0;
    return;
  }
  show_file.value = file;

  for (let i in choosing_files_index) {
    if (index == choosing_files_index[i]) {
      return;
    }
  }
  document.getElementsByClassName("file")[index].style.backgroundColor =
    "hsl(210,100%,85%)";
  choosing_files.push(file);
  choosing_files_index.push(index);
  choose_num.value++;
};

const deleteData = () => {
  for (let i in choosing_files) {
    api.deleteFile(choosing_files[i]).then((res) => {
      if (i == choosing_files.length - 1) {
        choosing_files = [];
        choosing_files_index = [];
        refresh();
      }
    });
  }
};
</script>

<style lang="less" scoped>
// 兼容css
.right-click {
  position: fixed;
  left: 0;
  top: 0;
  height: fit-content;
  width: 130px;
  z-index: 1500;
}
.file-operation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10%;
  //   background-color: antiquewhite;
  align-items: center;
  display: flex;
}
.file-container {
  position: absolute;
  //   background: red;
  top: 10%;
  height: 89%;
  left: 0;
  border: 0.5px solid rgba(197, 197, 197, 0.219);
  width: 99%;
  overflow: scroll;
  //   display: flex;
}
// .arrow{
//     position: fixed;
//     left: 10vw;
//     top: 60vh;
//     z-index: 5000;
//     font-size: 100px;
//     font-weight: 1000;
//     background: white;
//     color: hsl(220,90%,40%);
// }
// .ani{
//     background: transparent;
//     color: aqua !important;
//     animation: identifier 2.4s linear infinite;
//     @keyframes identifier {
//         0%{}
//         100%{
//             transform: translateX(1480px);
//         }
//     }
// }
</style>

