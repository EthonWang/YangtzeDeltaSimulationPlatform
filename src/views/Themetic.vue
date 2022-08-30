<!-- 主题：专题展示 -->
<!-- 设计人：于晶晶、张子卓 -->
<!-- 功能：展示20个科学专题专题及其对应的数据、案例 -->
<template>
  <div class="about">
    <el-row style="margin-top: 5vh">
      <el-col :offset="2" :span="4">
        <el-card>
          <template #header>
            <span style="font-size: 20px; font-weight: 800">专题分类</span>
          </template>
          <el-tree
            ref="treeRef"
            :data="modelTreeData"
            node-key="label"
            @node-click="handleNodeClick"
            :default-expand-all="true"
            :highlight-current="true"
          >
            <template class="custom-tree-node" v-slot="{ node, data }">
              <span @click="(checked) => getCurrentNode(checked, data)">{{
                node.label
              }}</span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :offset="1" :span="15">
        <el-card style="padding-bottom: 40px">
          <el-row style="align-items: center; justify-content: space-between">
            <h2 class="thematicName">{{ thematicName }}</h2>
            <el-icon
              :size="60"
              color="#246abd"
              style="cursor: pointer; margin-right: 15px"
            >
              <el-tooltip content="编辑专题" placement="top" effect="light">
                <Edit @click="editThematic" v-if="isAdmin">编辑专题</Edit>
              </el-tooltip>
              <el-tooltip content="添加案例" placement="top" effect="light">
                <CirclePlus v-if="isAdmin" @click="newCases" />
              </el-tooltip>
            </el-icon>
          </el-row>
          <el-row>
            <p class="descriptionText">{{ thematicItem.introduction }}</p>
          </el-row>
          <div>
            <h3 class="typeName">相关案例</h3>
            <el-divider></el-divider>
            <div
              style="
                display: flex;
                align-items: center;
                width: 100%;
                flex-wrap: wrap;
              "
              v-if="themeCase.length != 0"
            >
              <template v-for="(item, key) in themeCase" :key="key">
                <div class="caseCard">
                  <div class="caseImageWrap">
                    <el-image
                      class="caseImage"
                      @click="goCaseInfo(item.id)"
                      :src="baseUrl + item.thumbnail"
                      fit="fill"
                    ></el-image>
                    <div class="imageMask">
                      <img :src="mdOpenIcon" class="caseIcon" />
                      <span>打开案例</span>
                    </div>
                  </div>
                  <div class="cardText">
                    <el-tooltip
                      effect="dark"
                      placement="bottom"
                      content="查看案例详情"
                    >
                      <h4
                        class="font-size-1"
                        style="cursor: pointer"
                        @click="goCaseInfo(item.id)"
                      >
                        {{ item.name }}
                      </h4>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </div>
            <div class="descriptionText" v-else>待补充</div>
            <div class="dataBlock">
              <edit-case-draw
                ref="createCaseRef"
                title="新增案例"
                :editing-case-info="createCases"
                @saveCase="saveCase"
                @cancelCase="cancelCase"
                theme=""
              >
              </edit-case-draw>
            </div>
          </div>
          <div>
            <h3 class="typeName">相关数据</h3>
            <el-divider></el-divider>
            <div
              style="
                display: flex;
                align-items: center;
                width: 100%;
                flex-wrap: wrap;
              "
            >
              <template v-for="(item, key) in relatedData" :key="key">
                <div class="caseCard">
                  <div class="caseImageWrap">
                    <el-image
                      class="caseImage"
                      @click="startSearch(item.name)"
                      :src="item.imgWebAddress"
                      v-if="item.imgWebAddress.indexOf('http://') >= 0"
                      fit="fill"
                    ></el-image>
                    <el-image
                      class="caseImage"
                      @click="startSearch(item.name)"
                      :src="dataServer + item.imgWebAddress"
                      v-else
                      fit="fill"
                    ></el-image>
                    <div class="imageMask">
                      <img :src="mdOpenIcon" class="caseIcon" />
                      <span>查看数据</span>
                    </div>
                  </div>
                  <div class="cardText">
                    <el-tooltip :content="item.name" placement="bottom">
                      <h4 class="font-size-1">{{ item.name }}</h4>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </div>
            <div class="dataBlock" v-if="isAdmin">
              请在此处上传与该专题相关的数据
              <el-button
                :icon="Plus"
                @click="router.push('/user/data')"
                size="large"
                class="hvr-grow"
                plain
              ></el-button>
            </div>
          </div>
          <div>
            <h3 class="typeName">专题描述</h3>
            <el-divider></el-divider>
            <div class="descriptionBlock">
              <template
                v-for="(item, key) in thematicItem.description"
                :key="key"
              >
                <p v-if="item.type == 'text'" class="descriptionText">
                  {{ item.value }}
                </p>

                <el-image
                  class="imageBlock"
                  v-if="item.type == 'image'"
                  :src="baseUrl + item.value"
                ></el-image>
              </template>
            </div>
          </div>
          <el-divider></el-divider>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer
      v-model="editDialogVisible"
      title="编辑问题信息"
      width="50%"
      @close="editDialogClose"
      draggable
    >
      <el-divider>问题简介</el-divider>
      <el-row class="editDialogRow"
        ><span>问题名称:</span>
        <el-col :span="20" :offset="1">
          <el-input disabled :placeholder="thematicName"></el-input>
        </el-col>
      </el-row>
      <el-row class="editDialogRow"
        ><span>问题简介:</span>
        <el-col :span="20" :offset="1">
          <el-input
            v-model="editThemeItem.introduction"
            type="textarea"
            placeholder="请输入问题简介"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-col>
      </el-row>
      <el-divider>相关案例</el-divider>
      <div
        style="
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 10px;
        "
      >
        <template v-for="(item, key) in relatedCases" :key="key">
          <el-card
            :body-style="{ padding: '0px' }"
            style="margin-left: 10px; margin-bottom: 10px"
          >
            <el-image
              class="caseImage"
              :src="baseUrl + item.thumbnail"
              fit="fill"
            ></el-image>
            <div
              style="
                display: flex;
                padding: 0 10px 10px 10px;
                flex-direction: column;
                align-items: center;
              "
            >
              <p style="line-height: 2; font-weight: bold; font-size: 0.6em">
                {{ item.name }}
              </p>
              <el-button
                style="width: 100%"
                size="small"
                @click="removeCases(key)"
                >移除
              </el-button>
            </div>
          </el-card>
        </template>
      </div>
      <el-row style="justify-content: center; margin-bottom: 10px">
        <el-button :icon="Plus" size="large" @click="showAllCases" plain
          >显示所有案例</el-button
        >
      </el-row>
      <el-table
        v-show="allCasesVisible"
        :data="tableData"
        table-layout="auto"
        style="width: 100%"
        max-height="300"
      >
        <el-table-column prop="name" label="案例名称" />
        <el-table-column prop="path" label="path" />
        <el-table-column prop="thumbnail" label="缩略图" width="80">
          <template #default="scope">
            <el-image
              style="width: 100%"
              :src="baseUrl + scope.row.thumbnail"
              :preview-src-list="[baseUrl + scope.row.thumbnail]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="addToTheme(scope.row)"
              >添加到专题</el-button
            >
            <el-button
              type="warning"
              size="small"
              @click="deleteCases(scope.row.id)"
              >删除此案例</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-divider>专题描述</el-divider>
      <el-row style="justify-content: space-around; margin-bottom: 10px">
        <el-button
          :icon="Plus"
          size="large"
          @click="newDescription('text')"
          plain
          >添加文字描述
        </el-button>
        <el-button
          :icon="Plus"
          size="large"
          @click="newDescription('image')"
          plain
          >添加图片描述
        </el-button>
      </el-row>
      <template v-for="(item, key) in description" :key="key">
        <el-row v-if="item.type == 'text'" class="editDialogRow">
          <span>专题描述:</span>
          <el-col :span="20" :offset="1" style="align-items: center">
            <el-input
              style="width: 90%"
              v-model="item.value"
              type="textarea"
              placeholder="请输入专题描述"
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
            <el-icon
              style="cursor: pointer; margin-left: 2%"
              @click="deleteDescription('text', key)"
              :size="20"
            >
              <Delete />
            </el-icon>
          </el-col>
        </el-row>
        <el-row v-if="item.type == 'image'" class="editDialogRow">
          <span>相关图片:</span>
          <el-col
            style="display: flex; flex-direction: row"
            :span="20"
            :offset="1"
          >
            <el-input
              placeholder="请上传案例缩略图"
              v-model="item.imageName"
              style="width: 94%"
            ></el-input>
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="baseUrl + '/uploadThemeImg'"
              :limit="1"
              method="post"
              :on-success="uploadDescImg"
              :on-exceed="handleExceed"
              :auto-upload="true"
              :show-file-list="false"
            >
              <template #trigger>
                <el-button
                  :icon="Upload"
                  @click="addImage(key)"
                  type="success"
                  plain
                  >上传图片
                </el-button>
              </template>
            </el-upload>
            <el-icon
              style="cursor: pointer; margin-left: 2%"
              @click="deleteDescription('image', key)"
              :size="20"
            >
              <Delete />
            </el-icon>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" @click="editOK">提交修改</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import {
  Plus,
  Edit,
  Upload,
  Delete,
  Select,
  CirclePlus,
} from "@element-plus/icons-vue";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import axios from "axios";
import { post, get } from "@/request/request_backup";
import EditCaseDraw from "components/Cases/editCaseDraw";
import { Encrypt, Decrypt } from "@/util/codeUtil";

const router = useRouter();
const store = useStore();
const dataServer = store.getters.devIpAddress;
const baseUrl = store.state.devBackIp;
const isAdmin = ref(false);

let user_info = localStorage.getItem("userInfo");
if (user_info) {
  user_info = JSON.parse(Decrypt(user_info));
  if (user_info.email == "opengms@126.com") {
    isAdmin.value = true;
  }
}

const mdOpenIcon = require("@/assets/img/icon/md-open.png");

onMounted(() => {
  let show_name = localStorage.getItem("show_themetic");
  if (show_name) {
    show_name = Decrypt(show_name);
    thematicName.value = show_name.replace("\n", "");
    getThemeInfo(show_name, findParentName(show_name));
  } else {
    thematicName.value = "流域生态环境演变";
    getThemeInfo("流域生态环境演变", "流域水循环及其驱动机制");
  }
});

const modelTreeData = ref([]);
modelTreeData.value = [
  {
    label: "流域水循环及其驱动机制",
    type: "problem",
    children: [
      {
        label: "流域生态环境演变",
        type: "subProblem",
      },
      {
        label: "流域碳水耦合循环",
        type: "subProblem",
      },
      {
        label: "地表地下水耦合",
        type: "subProblem",
      },
      {
        label: "湖泊水环境监测",
        type: "subProblem",
      },
      {
        label: "其他流域专题",
        type: "subProblem",
      },
    ],
  },
  {
    label: "全球变化与区域环境演化",
    children: [
      {
        label: "海岸带变迁",
        type: "subProblem",
      },
      {
        label: "河口海岸水动力",
        type: "subProblem",
      },
      {
        label: "湖泊碳循环",
        type: "subProblem",
      },
      {
        label: "土壤碳氮循环",
        type: "subProblem",
      },
      {
        label: "土壤氮转化过程及其环境效应",
        type: "subProblem",
      },
      {
        label: "其他环境或演化专题",
        type: "subProblem",
      },
    ],
  },
  {
    label: "城市化与人地关系协调发展",
    children: [
      {
        label: "城市扩张",
        type: "subProblem",
      },
      {
        label: "湿地保护",
        type: "subProblem",
      },
      {
        label: "农业生态",
        type: "subProblem",
      },
      {
        label: "人地关系",
        type: "subProblem",
      },
      {
        label: "城市水问题",
        type: "subProblem",
      },
      {
        label: "自然遗产",
        type: "subProblem",
      },
      {
        label: "城市群发展",
        type: "subProblem",
      },
      {
        label: "其他城市或人地关系专题",
        type: "subProblem",
      },
    ],
  },
  {
    label: "灾害响应与治理",
    children: [
      {
        label: "台风与风暴潮",
        type: "subProblem",
      },
      {
        label: "洪涝水环境灾害",
        type: "subProblem",
      },
      {
        label: "地质灾害",
        type: "subProblem",
      },
      {
        label: "大气污染",
        type: "subProblem",
      },
      {
        label: "其他灾害专题",
        type: "subProblem",
      },
    ],
  },
];

const tableData = ref([]);
const getAllCases = () => {
  tableData.value = [];
  get("/case/getAllCase").then((res) => {
    res.data.data.map((item) => {
      tableData.value.push({
        name: item.name,
        path: item.path,
        createTime: item.createTime,
        id: item.id,
        thumbnail: item.thumbnail,
      });
    });
  });
};
//添加案例到专题
const addToTheme = (row) => {
  relatedCases.value.push({
    name: row.name,
    path: row.path,
    thumbnail: row.thumbnail,
    id: row.id,
  });
};
const deleteCases = (id) => {
  get("/case/deleteCaseById/" + id).then((res) => {
    ElNotification({
      message: "案例已从数据库中删除！",
      type: "success",
    });
    //删除案例后获取更新后的案例列表
    getAllCases();
  });
};

//新增案例
const createCaseRef = ref();
const createCases = ref({});
const newCases = () => {
  createCaseRef.value.showCase();
  createCases.value = {
    name: "",
    path: "",
    thumbnail: "",
    description: [],
    caseAuthor: [],
    theme: "",
    dataList: [],
  };
};
const saveCase = (data) => {
  if (data.name != "") {
    post("/case/createCase", data).then((res) => {
      if (res.msg == "Success") {
        ElNotification({
          message: res.data,
          type: "success",
          duration: 10000,
        });
      }
      cancelCase();
    });
  } else {
    alert("请输入案例名称！");
  }
};
const cancelCase = () => {
  createCaseRef.value.cancelCase();
};

const thematicName = ref("");
const thematicItem = ref({});
const editThemeItem = ref({});
const relatedData = ref([]);

const startSearch = function (searchValue) {
  if (user_info == null || user_info == undefined) {
    ElMessage("请登录");
    router.push("/login");
  } else {
    router.push({
      path: "/resourse",
      query: { searchValue },
    });
  }
};

let tagClass = "problemTags";
const getThemeInfo = (thematicName, tagName) => {
  get("/getTheme/" + thematicName).then((res) => {
    let themeInfo = res.data.data;
    if (themeInfo != null) {
      thematicItem.value = themeInfo;
      getCaseById(themeInfo.relatedCases);
    } else {
      thematicItem.value = {};
      relatedCases.value = [];
      description.value = [];
    }
  });

  let DTO = {
    asc: false,
    page: 1,
    pageSize: 16,
    searchText: "",
    sortField: "createTime",
    tagClass: tagClass,
    tagName: tagName,
  };
  axios({
    url: dataServer + "/getResourceDataList",
    method: "post",
    //忽略contentType
    contentType: false,
    //取消序列换 formData本来就是序列化好的
    processData: false,
    dataType: "json",
    data: DTO,
  }).then(
    (res) => {
      relatedData.value = res.data.data.content;
    },
    (err) => {
      console.log(err);
    }
  );
};

const themeCase = ref([]);
const getCaseById = (idList) => {
  themeCase.value = [];
  let body = {
    ids: idList,
  };
  post("/getCasesInfo", body).then((res) => {
    let caseResult = res.data;
    caseResult.map((item) => {
      themeCase.value.push({
        name: item.name,
        path: item.path,
        thumbnail: item.thumbnail,
        id: item.id,
      });
    });
  });
};
const toCase = (path) => {
  router.push("/case/" + path + "/");
};
const goCaseInfo = (id) => {
  router.push({
    path: "/caseinfo/",
    query: {
      caseId: id,
    },
  });
};
const editDialogVisible = ref(false);
const editThematic = () => {
  editDialogVisible.value = true;
  editThemeItem.value = JSON.parse(JSON.stringify(thematicItem.value));
  if (editThemeItem.value.relatedCases != null) {
    relatedCases.value = [];
    relatedCases.value = JSON.parse(JSON.stringify(themeCase.value));
  } else {
    relatedCases.value = [];
  }
  if (editThemeItem.value.description != null) {
    description.value = [];
    editThemeItem.value.description.map((item) => {
      description.value.push(item);
    });
  } else {
    description.value = [];
  }
};

const relatedCases = ref([]);

const removeCases = (key) => {
  ElMessageBox.confirm("确认移除此案例吗？")
    .then(() => {
      relatedCases.value.splice(key, 1);
      ElMessage({
        type: "success",
        message: "案例已移除！",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消移除！",
      });
    });
};
const allCasesVisible = ref(false);
const showAllCases = () => {
  getAllCases();
  allCasesVisible.value = true;
};
const editDialogClose = () => {
  allCasesVisible.value = false;
};

const description = ref([]);
const newDescription = (type) => {
  if (type == "text") {
    description.value.push({
      type: "text",
      value: "",
    });
  } else {
    description.value.push({
      type: "image",
      value: "",
    });
  }
};

const uploadDescImg = (res, uploadFile) => {
  let descriptionTemp = description.value;
  let key = tempKey.value;
  descriptionTemp[key].value = res.data.imgWebPath;
  descriptionTemp[key].imageName = uploadFile.name;
  description.value = descriptionTemp;
};
const deleteDescription = (type, key) => {
  if (type == "text") {
    description.value.splice(key, 1);
  } else {
    description.value.splice(key, 1);
  }
};
//用于标识当前案例或者描述的索引
const tempKey = ref("");
const addImage = (key) => {
  tempKey.value = key;
};
const editOK = () => {
  let bodyData = {
    name: thematicName.value,
    introduction: editThemeItem.value.introduction,
    relatedCases: relatedCases.value,
    relatedData: [],
    description: description.value,
  };
  let successMessage = "完成编辑";
  saveToServer(bodyData, successMessage);
  editDialogVisible.value = false;
};
const saveToServer = (bodyData, successMessage) => {
  post("/saveTheme", bodyData).then((res) => {
    if (res.code == 0) {
      ElNotification({
        title: "Success",
        message: successMessage,
        type: "success",
        duration: 10000,
      });
      thematicItem.value = bodyData;
      getCaseById(bodyData.relatedCases);
    }
  });
};

const editCancel = () => {
  ElMessage({
    type: "info",
    message: "取消编辑！",
  });
  editDialogVisible.value = false;
};

const getCurrentNode = (checked, data) => {
  // thematicName.value = data.label;
  //
  // console.log("currentNode",data)
  // getThemeInfo(thematicName.value);
};
const treeRef = ref();
const handleNodeClick = (node, node2) => {
  let tagName = "";
  if (node.type == "subProblem") {
    tagName = node2.parent.data.label;
    thematicName.value = node.label;
    localStorage.setItem("show_themetic", Encrypt(node.label));
    getThemeInfo(node.label, tagName);
  } else {
    console.log("problem", node);
  }
};

const allThematic = ref([]);
allThematic.value = [
  {
    name: "流域生态环境演变",
    introduction:
      "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
      "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。",
    relatedCases: [
      {
        name: "SWMM",
        path: "SWMM",
        thumbnail: "/img/swmm.2f8c8c5d.png",
        description:
          "SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
      },
      {
        name: "长三角降雨预报专题",
        path: "rainForecast",
        thumbnail: "/img/rainForecast.d75c80f8.png",
        description: "长三角降雨预报专题",
      },
      {
        label: "土壤碳氮循环",
      },
      {
        label: "土壤氮转化过程及其环境效应",
      },
    ],
  },
  {
    label: "灾害响应与治理",
    children: [
      {
        type: "image",
        value:
          "/img/%E6%B5%81%E   5%9F%9F%E7%94%9F%E6%80%81%E7%8E%AF%E5%A2%83%E6%BC%94%E5%8F%98.ed4630ac.png",
      },
    ],
  },
  {
    name: "流域碳水耦合循环",
    introduction:
      " 在气候变化背景下,人类和流域生态系统的水平衡及碳平衡已成为首要环境问题。气候变化深刻影响到碳水循环多过程及其多向反馈作用机制,进一步加剧水资源供需矛盾,导致生态系统的碳捕获能力降低。流域碳水循环的研究能够为水资源与生态环境保护规划提供直接支持,还能够为大型水利工程提供依据,具有较为显著的实践意义。",
    relatedCases: [
      {
        label: "地质灾害",
      },
      {
        label: "大气污染",
      },
    ],
    relatedData: [],
  },

  {
    label: "城市化与人地关系协调发展",
    children: [
      {
        label: "湿地保护",
      },
      {
        label: "城市扩张",
      },
      {
        label: "农业生态",
      },
    ],
  },
];
const findParentName = (childName) => {
  for (let i in allThematic.value) {
    let parent = allThematic.value[i].label;
    for (let j in allThematic.value[i].children) {
      if (allThematic.value[i].children[j].label == childName) {
        return parent;
      }
    }
  }
  return "流域水循环及其驱动机制";
};
</script>

<style lang="less" scoped>
.about {
  top: 65px;
  background-color: hsl(0, 0%, 98%);
  overflow: scroll;
}
@imageHeight: 100px;
@imageWidth: 160px;
.caseImageWrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;

  height: @imageHeight;
  width: @imageWidth;
  cursor: pointer;
}

.caseImage {
  height: @imageHeight;
  width: @imageWidth;
  border-bottom: 1px solid lightgray;
}

.imageMask {
  height: @imageHeight;
  width: @imageWidth;
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: hsl(0, 0%, 98%);
  pointer-events: none;
  transition: opacity 200ms linear;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.caseImageWrap:hover .imageMask {
  opacity: 1;
}

.caseIcon {
  width: 1em;
}

.font-size-1 {
  line-height: 1.5;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cardText {
  padding: 0.5rem;
  text-align: center;
  width: 160px;
}

.caseCard {
  margin-right: 20px;
  margin-bottom: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.editDialogRow {
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
  justify-content: center;
}

.dataBlock {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.descriptionBlock {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.descriptionText {
  text-indent: 2em;
}

.imageBlock {
  width: 30vw;
  margin-top: 15px;
  margin-bottom: 15px;
  animation: scale-in-center 1s both;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
@keyframes scale-in-center {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.typeName {
  animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;
  border-left: 8px solid #4ba0ff;
  padding: 0 15px;
  margin-top: 24px;
}

@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

/* Grow */
.hvr-grow {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
  margin-left: 30px;
}

.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/deep/ .el-card__header {
  text-align: center;
  font-size: 1.2em;
  padding: 10px 15px;
  background-color: lightgray;
}

.case-contain {
  position: relative;
  left: 0%;
  top: 4%;
  height: 85%;
  width: 100% - 2 * $left;
  padding-bottom: 50px;
  display: flex;
  //   flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;

  .scrollbar {
    height: 86%;
  }

  .onecase {
    height: 600px;
    margin: 1%;
    // margin-right: 0px;
    // float: left;
    // flex: 5;
    width: 30%;
    min-width: 260px;

    // position: relative;
  }
}
</style>
