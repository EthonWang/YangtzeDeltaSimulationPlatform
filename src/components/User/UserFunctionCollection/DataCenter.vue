<!-- ·主题：数据中心 -->
<!-- ·设计人：张子卓 -->
<!-- ·功能： -->
<!-- 1.个人空间数据的存储、展示、上传、下载、编辑、删除、移动 -->
<!-- 2.数据关系图谱的查看 -->
<!-- 3.数据加入实验室 -->
<template>
  <div style="height: 100%; width: 100%">
    <div class="file-controller" style="">
      <div class="file-operation">
        <el-button
          v-if="!publicState"
          type="success"
          plain
          @click="changePublicState()"
          ><el-icon><OfficeBuilding /></el-icon>&nbsp;共享空间</el-button
        >
        <el-button
          v-if="publicState"
          type="warning"
          plain
          @click="changePublicState()"
          ><el-icon><UserFilled /></el-icon>私人空间</el-button
        >
        <el-button v-if="!publicState" round @click="back"
          ><el-icon><d-arrow-left /></el-icon>&nbsp;返回</el-button
        >
        <el-button v-if="!publicState" round @click="refresh"
          ><el-icon><Refresh /></el-icon>&nbsp;刷新</el-button
        >
        <el-button
          v-if="!publicState"
          type="primary"
          @click="dialogVisible = true"
          ><el-icon><Sort /></el-icon>&nbsp;上传数据</el-button
        >
        <el-button v-if="!publicState" type="primary" @click="createFolder()"
          ><el-icon><folder-add /></el-icon>&nbsp;新建文件夹</el-button
        >

        <el-breadcrumb :separator-icon="ArrowRight" style="margin-left: 2%">
          <el-breadcrumb-item v-for="item in breadcrumbs" :key="item">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div
        v-loading="loading"
        element-loading-text="切换数据空间"
        element-loading-background="hsla(210, 50%, 15%, 0.6)"
        class="file-container"
        :class="{ public_file_container: publicState }"
      >
        <div
          style="
            position: absolute;
            height: 100%;
            width: 100%;
            overflow: scroll;
          "
          @click="cancelChoose($event)"
        >
          <FileItem
            v-for="(file, index) in file_data_choose"
            :key="file"
            :prop_file="file"
            :prop_index="index"
            @choose_f="choose(file, index)"
            @comeIn_f="comeIn(file)"
            @create-folder_f="createFolder(index)"
            @contextmenu.prevent="rightClick($event, file, index)"
          ></FileItem>
        </div>

        <!-- <div
          style="position: absolute; width: 100%; height: 100%;z-index: 2;"
          @click="choose(null, -1)"
        ></div> -->
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
    <div class="file-detail-controller">
      <FileDetail
        style="width: 100%; height: 100%"
        :file="show_file"
        :num="choose_num"
        :publicState="publicState"
        @update:file="show_file = $event"
        @deleteData="deleteData"
        @downloadData1="downloadData"
        @addToTask="addToTask()"
        @showMoveSpan="showMoveSpan()"
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
            action="http://172.21.213.44:8999/resource/saveDataItem"
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
        v-for="(task, index) in task_list"
        :key="task"
        @click="addDataToTask(task)"
        style="margin: 5px"
      >
        <el-icon><Monitor /></el-icon> &nbsp;
        <span v-if="index == 0" style="color: hsl(210, 100%, 40%)">{{
          task.name
        }}</span
        ><span v-else>{{ task.name }}</span></el-button
      >

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show_task = false">取消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="moveSpanShow"
      title="移动到"
      width="40%"
      :before-close="handleClose"
    >
      <el-button
        @click="moveData({ id: last_id[last_id.length - 1] })"
        style="margin: 5px"
        v-if="last_id.length != 0"
      >
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAAAwFBMVEUAAAD/2Ur/20z/203/40X//3j/yiX/zCv/3lD/2kv/yib/yiX/yib/2kr/2kr/yiX/2kv/2kv/yyb/2UT/1Tv/20H/yib/2kr/yib/2kr/yiX/20v/2kr/3Uz/5Vj/2kr/ySX/ySX/yiX/2Ur/20v/2Uz/ySj/zSf/20z/ySb/2kv/2Ur/2Ur/2Uv/yiX/0DX/yib/2Uz/yiX/yyf/20v/ySf/2kr/ySf/20z/2Uz/yyb/4k7/////2Ur/ySX/zS9+lhVZAAAAPXRSTlMAr1RGBQKWFw2o9PHt69/YiYBpKyIT+/bLwIFfWDMJ8OPHv7ePbEdBP+DU0tG8uKmnopCEd3duVU02NhoBsiz/2wAAAaxJREFUeNrt1GdSIzEQQOE2nuhsnCNhgWVzDoQW978V8J/CowkSqnrfCV5J3S0AAAAAAAAAXhVdJefDjjlg3vuw/L7+l4ovadI1NoY/b8WDaN0x1oZ/MnEsPTOldH/NxKXJqSmrdxyLM+mpqWA5FUeiM1NJ7724sTYVzY/FhbRjKksiaV5iavC1+dKoa+qQSNOuTD1emNM3+PNP5k3v/rmpSW8qjRqauixjadLzcQpiTE19uqk06KFG39oHXU8yKUedO8m3WRChTxbjLIxQ1f42kFDVURxIqLbiQEJ1FEqobkIJ7WeBhOoolNDFLJBQ3YQS2goldBEHEqp3oYTuQgn9H0roEaGEEkoooYQSSiihhBZHKKGEEkoooYQSSqgNQgkllFBCCSWUUEJtEEoooYQSSiihhBJqg9DD+urVtRT1Wb2aSlHv1Ku9FDVWnz5JYRP1aSzFDdSjnRR3qf6sxELk8UlvxMaR+pKLnQv142MmdmI/t7Q/FVv7XN0bTMTe/VhdW82klN0XdWmwiaWsdn6ijqwu91JF1P47+tFqVn7xezsTAAAAAAAAAK97BM+evOtMrXyJAAAAAElFTkSuQmCC"
          alt=""
          style="width: 20px"
        />
        &nbsp; >><span>移动至上级目录</span></el-button
      >

      <el-button
        v-for="folder in file_data_choose.filter((item) => {
          if (item.type == 'folder' && !choosing_files.includes(item)) {
            return item;
          }
        })"
        :key="folder"
        @click="moveData(folder)"
        style="margin: 5px"
      >
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAAAwFBMVEUAAAD/2Ur/20z/203/40X//3j/yiX/zCv/3lD/2kv/yib/yiX/yib/2kr/2kr/yiX/2kv/2kv/yyb/2UT/1Tv/20H/yib/2kr/yib/2kr/yiX/20v/2kr/3Uz/5Vj/2kr/ySX/ySX/yiX/2Ur/20v/2Uz/ySj/zSf/20z/ySb/2kv/2Ur/2Ur/2Uv/yiX/0DX/yib/2Uz/yiX/yyf/20v/ySf/2kr/ySf/20z/2Uz/yyb/4k7/////2Ur/ySX/zS9+lhVZAAAAPXRSTlMAr1RGBQKWFw2o9PHt69/YiYBpKyIT+/bLwIFfWDMJ8OPHv7ePbEdBP+DU0tG8uKmnopCEd3duVU02NhoBsiz/2wAAAaxJREFUeNrt1GdSIzEQQOE2nuhsnCNhgWVzDoQW978V8J/CowkSqnrfCV5J3S0AAAAAAAAAXhVdJefDjjlg3vuw/L7+l4ovadI1NoY/b8WDaN0x1oZ/MnEsPTOldH/NxKXJqSmrdxyLM+mpqWA5FUeiM1NJ7724sTYVzY/FhbRjKksiaV5iavC1+dKoa+qQSNOuTD1emNM3+PNP5k3v/rmpSW8qjRqauixjadLzcQpiTE19uqk06KFG39oHXU8yKUedO8m3WRChTxbjLIxQ1f42kFDVURxIqLbiQEJ1FEqobkIJ7WeBhOoolNDFLJBQ3YQS2goldBEHEqp3oYTuQgn9H0roEaGEEkoooYQSSiihhBZHKKGEEkoooYQSSqgNQgkllFBCCSWUUEJtEEoooYQSSiihhBJqg9DD+urVtRT1Wb2aSlHv1Ku9FDVWnz5JYRP1aSzFDdSjnRR3qf6sxELk8UlvxMaR+pKLnQv142MmdmI/t7Q/FVv7XN0bTMTe/VhdW82klN0XdWmwiaWsdn6ijqwu91JF1P47+tFqVn7xezsTAAAAAAAAAK97BM+evOtMrXyJAAAAAElFTkSuQmCC"
          alt=""
          style="width: 20px"
        />
        &nbsp; ><span>{{ folder.name }}</span></el-button
      >

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="moveSpanShow = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- <div class="arrow">>>>>>>>>>>>>>>>>>>>></div>
  <div class="arrow ani">></div> -->
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
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
import { scienceChoose } from "@/assets/user/scienceChoose";
import { ElLoading } from "element-plus";
import { Encrypt, Decrypt } from "@/util/codeUtil";

const userInfo = JSON.parse(Decrypt(localStorage.getItem("userInfo")));
const task_api = new taskApi();
const show_task = ref(false);
const task_list = ref([]);
const route = useRoute();
const publicState = ref(false);
const loading = ref(false);

// 判断是否在实验室
const isInLab = ref(false);
let routeSplit = route.path.split("/");

if (routeSplit[routeSplit.length - 1] == "") {
  routeSplit.splice(routeSplit.length - 1, 1);
}
if (routeSplit[routeSplit.length - 1] == "model") {
  isInLab.value = true;
}
const upload_header = { token: Decrypt(localStorage.getItem("token")) };
task_api.getTaskList(userInfo.id).then((res) => {
  for (let i = res.data.data.length - 1; i >= 0; i--) {
    task_list.value.push(res.data.data[i]);
  }
});
const fileList = ref([]);

// 判断是否在实验室，是的话直接加入当前实验室
const addToTask = () => {
  if (isInLab.value) {
    let loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    addDataToTask(nowTask.value);
    setTimeout(() => {
      loading.close();
      location.reload();
    }, 1000);
  } else {
    show_task.value = true;
  }
};
let nowTask = ref(localStorage.getItem("task"));
if (nowTask.value) {
  nowTask.value = JSON.parse(Decrypt(nowTask.value));
}

const addDataToTask = (task) => {
  let dataList = [];
  for (let i in choosing_files.value) {
    if (choosing_files.value[i].type != "folder") {
      let data = choosing_files.value[i];
      data["source"] = "cloud";
      data["type"] = "data";
      data["visualizationBoolean"] = false;
      data["visualType"] = choosing_files.value[i].name.split(".")[1];
      data["geoType"] = "line";
      dataList.push(data);
    }
  }
  console.log(task);
  for (let i in dataList) {
    task.dataList.push(dataList[i]);
  }
  console.log(task);
  task_api.editTask(task).then((res) => {
    localStorage.setItem("task", Encrypt(JSON.stringify(task)));
    ElMessage({
      type: "success",
      message: "成功加入实验室",
    });
  });
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
    name: "长江三角洲",
    type: "folder",
    description: "",
    rename: false,
    publicBoolean: false,
    time: "2022/12/12",
    author: "NNU",
    problemTags: [],
  },
]);
//问题面板变化后的数据筛选
const file_data_choose = ref([]);
watch(
  () => scienceChoose.value,
  (newval, oldval) => {
    file_data_choose.value = file_data.value.filter((item) => {
      if (item.problemTags == "" || item.problemTags == []) {
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
  () => file_data.value,
  (newval, oldval) => {
    file_data_choose.value = newval.filter((item) => {
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
const breadcrumbs = reactive(["/ 根目录"]);
const show_right = ref(false);
const right_file = ref(Object);

setTimeout(() => {
  refresh();
}, 320);
const successUpload = () => {
  innerVisible.value = false;
  dialogVisible.value = false;
  fileList.value = [];
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
    api
      .createFolder(
        now_id.value,
        file_data_choose.value[index].name,
        file_data_choose.value[index].problemTags.toString()
      )
      .then((res) => {
        file_data_choose.value[index].rename = false;
        refresh();
        return;
      });
  }
  if (index == -1) {
    file_data_choose.value.unshift({
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

const tackleData = (res) => {
  console.log(res);
  for (let i in res.data) {
    let data = JSON.parse(JSON.stringify(res.data[i]));
    data.name = data.name.split(".")[0];
    if (res.data[i].problemTags[0] != "" && res.data[i].problemTags != []) {
      res.data[i].problemTags = data.problemTags.split(",");
      for (let j = 0; j < res.data[i].problemTags.length; j++) {
        res.data[i].problemTags[j] = res.data[i].problemTags[j].replace(
          "\n",
          ""
        );
        res.data[i].problemTags[j] = res.data[i].problemTags[j].replace(
          "\r",
          ""
        );
      }
    }
  }
  file_data.value = res.data.reverse();
  console.log("file data is :", file_data.value);
  choose_num.value = 0;
  choosing_files.value = [];
  choosing_files_index = [];
  ElMessage({
    type: "success",
    message: "成功",
  });
};

const refresh = () => {
  if (publicState.value) {
    api.getAllPublicFile().then((res) => {
      tackleData(res.data);
    });
  } else {
    api.getFile(now_id.value).then((res) => {
      tackleData(res);
    });
  }
};
const comeIn = (file) => {
  last_id.push(now_id.value);
  now_id.value = reactive(file.id);
  breadcrumbs.push(file.name);
  refresh();
};
const back = () => {
  if (last_id.length == 0) {
    ElMessage("已是最上级");
    return;
  }
  now_id.value = last_id.pop();
  breadcrumbs.pop();
  refresh();
};

const confirmChange = (type, index) => {};
const downloadData = () => {
  let i = 0;
  //注意：循环请求后台用这个而非for循环
  let downloadInterval = setInterval(() => {
    let file = choosing_files.value[i];

    if (file.type == "folder") {
      ElMessage.error("请选择文件而非文件夹");
    } else {
      api.downloadFile(file).then(() => {
        ElMessage({
          message: "下载成功",
          type: "success",
        });
      });
    }
    i++;
    if (i >= choosing_files.value.length) {
      clearInterval(downloadInterval);
    }
  }, 500);
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
let choosing_files = ref([]);
let choosing_files_index = [];

const choose = (file, index) => {
  if (index == -1) {
    for (let i in choosing_files_index) {
      document.getElementsByClassName("file")[
        choosing_files_index[i]
      ].style.backgroundColor = "";
    }
    choosing_files_index = [];
    choosing_files.value = [];
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
  choosing_files.value.push(file);
  choosing_files_index.push(index);
  choose_num.value++;
};

const cancelChoose = (e) => {
  let firstClass = e.path[1].classList[0];
  if (firstClass != "file") {
    choose(null, -1);
  }
};

const deleteData = () => {
  for (let i in choosing_files.value) {
    api.deleteFile(choosing_files.value[i]).then((res) => {
      if (i == choosing_files.value.length - 1) {
        choosing_files.value = [];
        choosing_files_index = [];
        refresh();
      }
    });
  }
};
const changePublicState = () => {
  publicState.value = !publicState.value;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  refresh();
};

const moveSpanShow = ref(false);
const showMoveSpan = () => {
  moveSpanShow.value = true;
};
const moveData = (targetFolder) => {
  // show_file.value.parentId = targetFolder.id;
  let i = 0;
  loading.value = true;
  moveSpanShow.value = false;
  let moveOneData = setInterval(() => {
    choosing_files.value[i].parentId = targetFolder.id;
    api.editFile(choosing_files.value[i]).then((res) => {});
    i++;
    if (i == choosing_files.value.length) {
      setTimeout(() => {
        loading.value = false;
        refresh();

        clearInterval(moveOneData);
      }, 500);
    }
  }, 900);
};
</script>

<style lang="less" scoped>
// 兼容css
.file-detail-controller {
  position: absolute;
  background-color: hsla(220, 30%, 94%, 0.75);
  width: 20%;
  border: 1px solid hsla(220, 50%, 74%, 0.75);
  border-radius: 5px;
  right: 0;
  height: 100%;
}
.file-controller {
  position: absolute;
  width: 79%;
  height: 100%;
}
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
  border: 2px solid rgba(197, 197, 197, 0.8);
  width: 99%;
  border-radius: 5px;
  overflow: scroll;
  //   display: flex;
}
.public_file_container {
  transition: all 1s;
  border: 2px solid rgb(15, 177, 0);
  background-color: rgba(15, 177, 0, 0.15);
  box-shadow: 0px 0px 6px #00e6f6;
}
/deep/.el-loading-mask {
  height: 100%;
}
</style>

