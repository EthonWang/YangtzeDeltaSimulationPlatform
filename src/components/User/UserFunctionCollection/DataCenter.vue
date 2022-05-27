<template>
  <div style="height: 100%; width: 100%">
    <div style="position: absolute; width: 79%; height: 100%">
      <div class="file-operation">
        <!-- <el-button @click="showScience" id="expand"
        style="border: 0;"
      ><el-icon style="transform: scale(2) rotateY(180deg);"><Expand /></el-icon></el-button> -->
        <el-button circle
          ><el-icon><d-arrow-left /></el-icon
        ></el-button>
        <el-button circle @click="refresh"
          ><el-icon><Refresh /></el-icon
        ></el-button>
        <el-button type="primary" @click="dialogVisible = true"
          ><el-icon><Upload /></el-icon>&nbsp;上传数据</el-button
        >
        <el-button type="primary" @click="createFolder"
          ><el-icon><folder-add /></el-icon>&nbsp;新建文件夹</el-button
        >

        <el-breadcrumb :separator-icon="ArrowRight" style="margin-left: 2%">
          <el-breadcrumb-item>homepage</el-breadcrumb-item>
          <el-breadcrumb-item>promotion management</el-breadcrumb-item>
          <el-breadcrumb-item>promotion list</el-breadcrumb-item>
          <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="file-container">
        <div
          style="position: absolute; width: 100%; height: 100%"
          @click="choose(null, -1)"
        ></div>
        <div
          class="file"
          v-for="(file, index) in file_data"
          :key="file"
          @contextmenu.prevent="rightClick($event, file, index)"
          @click="choose(file, index)"
        >
          <span
            style="
              position: absolute;
              right: 10%;
              top: 10%;
              color: rgb(61, 204, 56);
            "
            v-if="file.isPublic"
            ><el-icon><Unlock /></el-icon
          ></span>
          <span
            style="
              position: absolute;
              right: 10%;
              top: 10%;
              color: rgb(228, 170, 10);
            "
            v-if="!file.isPublic"
            ><el-icon><Lock /></el-icon
          ></span>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAAAwFBMVEUAAAD/2Ur/20z/203/40X//3j/yiX/zCv/3lD/2kv/yib/yiX/yib/2kr/2kr/yiX/2kv/2kv/yyb/2UT/1Tv/20H/yib/2kr/yib/2kr/yiX/20v/2kr/3Uz/5Vj/2kr/ySX/ySX/yiX/2Ur/20v/2Uz/ySj/zSf/20z/ySb/2kv/2Ur/2Ur/2Uv/yiX/0DX/yib/2Uz/yiX/yyf/20v/ySf/2kr/ySf/20z/2Uz/yyb/4k7/////2Ur/ySX/zS9+lhVZAAAAPXRSTlMAr1RGBQKWFw2o9PHt69/YiYBpKyIT+/bLwIFfWDMJ8OPHv7ePbEdBP+DU0tG8uKmnopCEd3duVU02NhoBsiz/2wAAAaxJREFUeNrt1GdSIzEQQOE2nuhsnCNhgWVzDoQW978V8J/CowkSqnrfCV5J3S0AAAAAAAAAXhVdJefDjjlg3vuw/L7+l4ovadI1NoY/b8WDaN0x1oZ/MnEsPTOldH/NxKXJqSmrdxyLM+mpqWA5FUeiM1NJ7724sTYVzY/FhbRjKksiaV5iavC1+dKoa+qQSNOuTD1emNM3+PNP5k3v/rmpSW8qjRqauixjadLzcQpiTE19uqk06KFG39oHXU8yKUedO8m3WRChTxbjLIxQ1f42kFDVURxIqLbiQEJ1FEqobkIJ7WeBhOoolNDFLJBQ3YQS2goldBEHEqp3oYTuQgn9H0roEaGEEkoooYQSSiihhBZHKKGEEkoooYQSSqgNQgkllFBCCSWUUEJtEEoooYQSSiihhBJqg9DD+urVtRT1Wb2aSlHv1Ku9FDVWnz5JYRP1aSzFDdSjnRR3qf6sxELk8UlvxMaR+pKLnQv142MmdmI/t7Q/FVv7XN0bTMTe/VhdW82klN0XdWmwiaWsdn6ijqwu91JF1P47+tFqVn7xezsTAAAAAAAAAK97BM+evOtMrXyJAAAAAElFTkSuQmCC"
            v-if="file.type == 'folder'"
            style="width: 80%"
          />
          <img
            src="data:image/png;base64,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"
            v-if="file.type != 'folder' && file.type != 'zip'"
            style="width: 80%"
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAAA81BMVEUAAADJlliA0kCQqMj/c2zEwEJZzPl+zztVyPhVx/hVyPiA0DyA0T2D10Bh0/9/0DtVyfeA0DxXyflYyfpXzP/3rklVyPhVyPdVx/d+zzt/0Dt/zzt/0DxWyPhXyvl/0Tyq/1X///+XqcFWyPiA0Tx+0DvAxEOA0z2Gtde6pVqA1UCG2z1+zztVx/f9bWv9r0L///9dxu/rsVbvskGEzjz9y4b9v2f++/f+79n+8vL+3Nz9ypD9wm/9ioj9oaD9cGn9p0b+/Pv+0tH9c3H9h4b+6ur+6Oj+9Ob9enj+9vb+xsb+trX9r679mZf9xoj9fnz9uGv+eDTsAAAALHRSTlMAwCjLKEkn/PbUrJQ6GQ7zg3VRMhf58ezk3NXBr2xbUgMBzZiEZ0UuJiUkFb0s5qIAAAHjSURBVHja7dj3UttAEIDxC0mQ3LANoff0dsbpgUSAC72+/9NgHkA3i1bew8z3/avRzm92NCPpHBERERERERERUcRmNqqVRR/q+05+33yghUp1/VVZzFbqR6mg4d6UQp1b8l4PDbcwq3fOpl4NFbSu3mfqTaBeudOZJW8ETadV0Ja3gvqqaqGpHdTPKaAb3hDaUkCrltCKAlqxhKbbxaGLllCveD95U+g0UKBAgQIFChQoUKBAgQIFCrRE6HNp8wHoa+mQj8WhHWmHAeiBdMgLoJMFHQyzLLv9nV82ahAdetrvdSXtDeNCB0ddYWc3UaGXXXHnUaF9OfQ4KnRPDt0F+iShvT+59R4V9N9Obv+BAgUKFChQoJMPPfmb28mjgk7MZx7QCD93R1GhF3JoPyr0dFfq7A2jQjvZsfAJvYp+SJbtj7r+ld/99WzQiQ6dmGNHoA/pmbT5AFQ85FNx6FdpPwLQn9IhU0CBAgUKFChQoECBAgUKFCjQEqFNU2ijOHTFEppsFYeuWUKXXfHeWUJrCmgjMYTWnaKaHXTVaWo0raBJ3anatIK2nbK2DbTm1G02xw9N2q6EPq+NG7pad+X04e1KMi5oslwTMOVtf5kK9f5lfsEbG1uOiIiIiIiIiIiIZN0Br4ZJiTiBqxAAAAAASUVORK5CYII="
            v-if="file.type == 'zip'"
            style="width: 80%"
          />
          <!-- <br /> -->
          <span
            v-if="file.type != 'folder' && file.type != 'zip'"
            class="type"
            >{{ file.type }}</span
          >
          <span style="font-size: 16px; width: 90%" v-if="!file.rename"
            >{{ file.name }}
          </span>
          <span
            style="font-size: 16px; width: 100%; display: flex"
            v-if="file.rename"
            ><el-input
              v-model="file.name"
              maxlength="10"
              placeholder="请命名"
              type="text"
              @keyup.enter="confirmChange('rename', index)"
              style="text-align: center"
            /><el-button
              style="
                width: 10px;
                border: 0;
                position: absolute;
                background: transparent;
                right: 0;
              "
              @click="confirmChange('rename', index)"
              ><el-icon><FolderChecked /></el-icon
            ></el-button>
          </span>
        </div>
      </div>
    </div>
    <RightClick
      v-show="show_right"
      class="right-click"
      :file="right_file"
      @rename="confirmChange('rename', right_file.index)"
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
      ></FileDetail>
    </div>
    <el-dialog
      v-model="dialogVisible"
      style="position: fixed"
      title="数据上传"
      width="fit-content"
      :before-close="handleClose"
    >
      <el-upload
        class="upload-demo"
        action="/back/resource/saveDataItem"
        :data="{
          name: name,
          description: over,
          issueTags: problemTags,
          normalTags: problemTags,
          parentId: name,
        }"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽至此或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">一次上传一个数据</div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">退出</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >完成</el-button
          >
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
import FileDetail from "./FileDetail.vue";
import { time } from "echarts";
import { ElMessage } from "element-plus/lib/components";

const name = ref("45454");
const over = ref("74665");
const problemTags = ref("123");
const api = new Api();
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const dialogVisible = ref(false);
const file_data = reactive([
  {
    id: "565666",
    name: "长江",
    type: "folder",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "长江changjiang",
    type: "shp",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "上海",
    type: "zip",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: true,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "南京",
    type: "tiff",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "杭州路网",
    type: "png",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "苏州DEM",
    type: "camera raw",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "长江气象数据",
    type: "txt",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "长江三角洲农田分布",
    type: "excel",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
  {
    id: "565666",
    name: "上海城市热点分布",
    type: "zip",
    description: "changjiang is changjiang",
    rename: false,
    isPublic: false,
    time: "2022/12/12",
    author: "NNU",
    tags: ["台风与风暴湖", "人地关系"],
  },
]);
const show_right = ref(false);
const right_file = ref(Object);

let now_id = userInfo.id;
const createFolder = () => {
  api.createFolder(now_id, "").then(() => {
    file_data.push({
      id: "5689",
      name: "",
      type: "folder",
      description: "新建文件夹",
      rename: true,
      isPublic: false,
      time: "2022/12/12",
      author: "NNU",
      tags: ["台风与风暴湖", "人地关系"],
    });
  });
};

const uploadFile = (file_artribute, file_data) => {
  let file_send = file_artribute;
  file_send["data"] = file_data;
  api.uploadFile(file_send).then(() => {
    refresh();
  });
};
const refresh = () => {
  api.getFile(now_id);
};
const confirmChange = (type, index) => {
  //type指这个函数使用对应的功能
  if (type == "rename") {
    if (file_data[index].name == "") {
      ElMessage({
        message: "请给文件夹命名",
        type: "warning",
      });
      return;
    }
    file_data[index].rename = !file_data[index].rename;
    api.editFile(file_data[index]);
  }
};
const download = (file) => {
  if (file.type == "folder") {
    api.downloadFolder(file);
  }
  api.downloadFile(file).then(() => {
    ElMessage({
      message: "下载成功",
      type: "success",
    });
  });
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
const show_file = ref({
  id: "565666",
  name: "南京市管道数据",
  description:
    "这个数据适用于支撑SWMM模型的城市官网数据，共享到公共数据的目的是希望大家更好的应用SWMM模型。",
  time: "2022/12/12",
  author: "NNU",
  type: "shp",
  isPublic: true,
  rename: false,
  tags: ["台风与风暴湖", "人地关系"],
});
const choose_num = ref(0);
let choosing_files = [];
let last_clicks = [];
const choose = (file, index) => {
  if (index == -1) {
    for (let i in last_clicks) {
      document.getElementsByClassName("file")[
        last_clicks[i]
      ].style.backgroundColor = "";
    }
    last_clicks = [];
    choosing_files = [];
    choose_num.value = 0;
    return;
  }
  show_file.value = file;

  for (let i in last_clicks) {
    if (index == last_clicks[i]) {
      return;
    }
  }
  document.getElementsByClassName("file")[index].style.backgroundColor =
    "hsl(220,100%,95%)";
  choosing_files.push(file);
  last_clicks.push(index);
  choose_num.value++;
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
  .file {
    margin: 5px;
    position: relative;
    // background: blue;
    float: left;
    height: 220px;
    width: $height * 3/4;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    cursor: pointer;
    // justify-content: center;
    &:hover {
      background-color: rgba(35, 120, 247, 0.05);
      box-shadow: 0 1px 6px rgba(35, 120, 247, 0.05);
    }
    img {
      margin-top: 20%;
    }
    span {
      text-align: center;
    }
    .type {
      position: absolute;
      top: 52.5%;
      // margin-left: 4%;
      opacity: 0.8;
      max-width: 90px;
      line-height: 100%;
      color: rgb(255, 255, 255);
      font-weight: 800;
      font-size: auto;
    }
  }
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

